import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentEnrollCourses.css";

const StudentEnrollCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = sessionStorage.getItem("student_id");

    if (!studentId) {
      setError("Student ID not found");
      return;
    }

    fetch(`http://127.0.0.1:5000/StudentDashboardCourses?student_id=${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setError("Invalid data format received from server.");
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setError("Error fetching courses. Please try again later.");
      });
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/student-dashboard/course/${courseId}`);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (courses.length === 0) {
    return <div className="loading">No available courses at the moment.</div>;
  }

  return (
    <section className="student-courses">
      <div className="courses-container">
        <h2>Available Courses</h2>
        <div className="courses-list">
          {courses.map((course) => (
            <div
              className="course-card"
              key={course.course_id}
              onClick={() => handleCourseClick(course.course_id)}
            >
              <div className="course-thumbnail">
                <img
                  src={`../../assets/${course.image_url}`}
                  alt={course.course_name}
                />
              </div>
              <div className="course-details">
                <h3>{course.course_name}</h3>
                <p>{course.description}</p>
                <p className="price">${course.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentEnrollCourses;
