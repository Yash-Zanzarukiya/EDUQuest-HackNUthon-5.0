import React, { useState, useEffect } from "react";
import axios from "axios";

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  return (
    <div className="course-list">
      <h2>Course List</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>Description: {course.description}</p>
            <p>Duration: {course.duration} hours</p>
            <p>Price: ${course.price}</p>
            <p>Students Enrolled: {course.students}</p>
            <p>Published: {course.isPublished ? "Yes" : "No"}</p>
            <div>
              <iframe
                title={course.title}
                width="560"
                height="315"
                src={course.video}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <img src={course.thumbnail} alt={course.title} />
            <p>Tags: {course.course}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;
