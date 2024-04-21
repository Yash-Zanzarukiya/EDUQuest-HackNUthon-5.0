import React, { useState } from "react";
import axios from "axios";
import "./CourseManager.css"; // Import the CSS file for styling

function CourseManager() {
  const [formData, setFormData] = useState({
    id: "",
    video: null,
    title: "",
    description: "",
    duration: "",
    thumbnail: null,
    course: "",
    price: "",
    students: "",
    isPublished: false,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;


    const inputValue = type === "file" ? files[0] : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   const formDataToSend = new FormData();
    //   // Append all form data to FormData object
    //   Object.keys(formData).forEach((key) => {
    //     formDataToSend.append(key, formData[key]);
    //   });

    //   const response = await axios.post(
    //     "http://localhost:3000/api/courses",
    //     formDataToSend
    //   );
    // console.log("Course added:", response.data);
    console.log(formData);
    alert("Data inserted")

      setFormData({
        id: "",
        video: null,
        title: "",
        description: "",
        duration: "",
        thumbnail: null,
        course: "",
        price: "",
        students: "",
        isPublished: false,
      });
  } 
    // catch (error) {
    //   console.error("Error adding course:", error.message);
  // }
  


  return (
    <div className="course-manager">
      <h2>Add New Course</h2>
      <form className="course-form" onSubmit={handleSubmit}>
        <label htmlFor="video">Video:</label>
        <input
          type="file"
          id="video"
          name="video"
          accept="video/*"
          onChange={handleChange}
          required
        />

        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label htmlFor="thumbnail">Thumbnail:</label>
        <input
          type="file"
          id="thumbnail"
          name="thumbnail"
          accept="image/*"
          onChange={handleChange}
          required
        />

        <label htmlFor="course">Course Tags:</label>
        <input
          type="text"
          id="course"
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
        />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Course</button>
      </form>
    </div>
  );
}

export default CourseManager;
