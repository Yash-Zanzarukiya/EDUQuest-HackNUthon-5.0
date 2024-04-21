import React, { useState } from "react";
import "./VideoDetailsComponent.css";

const VideoDetailsComponent = ({ data }) => {
  let process = 3;
  const videos = [
    {
      _id: "6624736955725c11d4dcae02",
      name: "Section 2 Name",
      videos: [
        {
          _id: "6624758149ea9ee85baa8572",
          videoFile:
            "http://res.cloudinary.com/dof2rc7fl/video/upload/v1713665408/videos/lut5iierpseproth5oi5.mp4",
          title: "How Honey Bees make their house",
          description: "Its a video on Honey is made",
          duration: 7.445,
          thumbnail:
            "http://res.cloudinary.com/dof2rc7fl/image/upload/v1713665409/photos/lnvkh1r2iqszm9k9vfrh.jpg",
          isPublished: false,
          section: "6624736955725c11d4dcae02",
          owner: "66243e3a7193c260bd0a4493",
          createdAt: "2024-04-21T02:10:09.446Z",
          updatedAt: "2024-04-21T02:10:09.446Z",
          __v: 0,
          isCompleted: false,
        },

        {
          _id: "662477919d44b94355d2b329",
          videoFile: "https://youtu.be/VJov5QWEKE4?si=cqCbREGgFs4WQ0d2",
          title: "This is new Title 3",
          description: "this is updated",
          duration: 7.445,
          thumbnail:
            "http://res.cloudinary.com/dof2rc7fl/image/upload/v1713667607/photos/ozyjxcndcfmkyla1yixx.png",
          isPublished: true,
          section: "6624736955725c11d4dcae02",
          owner: "66243e3a7193c260bd0a4493",
          createdAt: "2024-04-21T02:18:57.114Z",
          updatedAt: "2024-04-21T02:48:43.069Z",
          __v: 0,
          isCompleted: true,
        },
        {
          _id: "662477919d44b94355d2b329",
          videoFile: "https://youtu.be/6KQeopPE36I?si=dOoKmuXFdcu5jVfj",
          title: "This is new Title 4",
          description: "this is updated",
          duration: 7.445,
          thumbnail:
            "http://res.cloudinary.com/dof2rc7fl/image/upload/v1713667607/photos/ozyjxcndcfmkyla1yixx.png",
          isPublished: true,
          section: "6624736955725c11d4dcae02",
          owner: "66243e3a7193c260bd0a4493",
          createdAt: "2024-04-21T02:18:57.114Z",
          updatedAt: "2024-04-21T02:48:43.069Z",
          __v: 0,
          isCompleted: false,
        },
      ],
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleCheckboxChange = async (videoId, isChecked) => {
    try {
      const response = await fetch(
        `/api/videos/${videoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },

        }
      );
      if (response.ok) {
        console.log("isCompleted toggled successfully");
      } else {
        console.error("Failed to toggle isCompleted");
      }
    } catch (error) {
      console.error("Error toggling isCompleted:", error.message);
    }
  };

  return (
    <div className="video-details-container">
      <div className="video-container">
        {selectedVideo ? (
          <div className="selected-video">
            <video key={selectedVideo._id} controls>
              <source src={selectedVideo.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-description">
              <h3>{selectedVideo.title}</h3>
              <p>{selectedVideo.description}</p>
              <p>Duration: {selectedVideo.duration} seconds</p>
            </div>
          </div>
        ) : (
          <div className="placeholder">Select a video from the list</div>
        )}
      </div>
      <div className="video-list-container">
        <h2>Video List</h2>
        <h3>Progress{process}/{videos.length }</h3>
        <ul>
          {videos[0].videos.map((video) => (
            <li
              key={video._id}
              className="video-list-item"
              onClick={() => handleVideoSelect(video)}
            >
              <input
                type="checkbox"
                checked={video.isCompleted}
                onChange={() =>
                  handleCheckboxChange(video._id, !video.isCompleted)
                }
              />
              <div className="video-list-item-details">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
                <p>Duration: {video.duration} seconds</p>
              </div>
            </li>
          ))}
        </ul>
      <button className="btn">Certificate</button>
      </div>
    </div>
  );
};

export default VideoDetailsComponent;
