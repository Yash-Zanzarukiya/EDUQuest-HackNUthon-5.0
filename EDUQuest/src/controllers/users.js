import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import { User } from "../models/users.js";
import { uploadPhotoOnCloudinary as uploadOnCloudinary } from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (_id) => {
  try {
    const user = await User.findById(_id);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new APIError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  let { username, password, fullName, email, university, gradYear } = req.body;

  if (
    [username, password, fullName, email].some((field) => field?.trim() === "")
  ) {
    throw new APIError(400, `all fields are required!!!`);
  }

  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExist) {
    throw new APIError(400, "User Already Exists...");
  }

  let avatarLocalPath = req.file?.path;

  let avatarRes = avatarLocalPath
    ? await uploadOnCloudinary(avatarLocalPath)
    : "";

  const createdUser = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    fullName,
    university,
    gradYear,
    avatar: avatarRes?.url,
  });

  const userData = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );

  if (!userData) {
    throw new APIError(500, "Something went wrong while registering the user");
  }

  // Send back data to frontend
  return res
    .status(201)
    .json(new APIResponse(200, userData, "Account Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password, username } = req.body;

  console.log("Here");

  // validate
  if (!email && !username) {
    throw new APIError(400, "Username or Email is required");
  }

  // find User
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new APIError(404, "User not Found");
  }

  const isCredentialValid = await user.isPasswordCorrect(password);

  if (!isCredentialValid) {
    throw new APIError(401, "Credential Invalid");
  }

  // generate and store tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // set tokens in cookie and send response
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  console.log(loggedInUser);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new APIResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "LoggedIn Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new APIResponse(200, {}, "Logged out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new APIError(401, "unauthorized request");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new APIError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new APIError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new APIResponse(
          200,
          { accessToken, newRefreshToken: refreshToken },
          "Access Token Granted Successfully"
        )
      );
  } catch (error) {
    throw new APIError(401, error?.message || "Invalid refresh token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Caution
  if (!oldPassword || !newPassword) {
    throw new APIError(400, "All Fields Required");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new APIError(401, "Old Password is not Correct");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new APIResponse(200, {}, "Password Changed Successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new APIResponse(201, req.user, "User fetched Successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, gradYear, university } = req.body;

  if (!fullName && !email && !university && !gradYear) {
    throw new APIError(400, "Atleast one field required");
  }

  const user = await User.findById(req.user?._id);

  if (fullName) user.fullName = fullName;

  if (email) user.email = email;

  if (gradYear) user.gradYear = gradYear;

  if (university) user.university = university;

  let updatedUserData = await user.save();

  updatedUserData = await User.findById(updatedUserData._id).select(
    "-password -refreshToken"
  );

  if (!updatedUserData) {
    new APIError(500, "Error while Updating User Data");
  }

  return res
    .status(200)
    .json(
      new APIResponse(200, updatedUserData, "Profile updated Successfully")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new APIError(400, "File required");
  }

  const avatarImg = await uploadOnCloudinary(avatarLocalPath);

  if (!avatarImg) {
    throw new APIError(500, "Error Accured While uploading File");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new APIError(500, "User not found");
  }

  user.avatar = avatarImg.url;

  const updatedUser = await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new APIResponse(200, updatedUser, "avatar updated Successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    throw new APIError(400, "no username found");
  }

  const userProfile = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        university: 1,
        avatar: 1,
        gradYear: 1,
      },
    },
  ]);

  if (!userProfile?.length) {
    throw new APIError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(new APIResponse(200, userProfile, "Channal Fetched Successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
  getUserProfile,
};
