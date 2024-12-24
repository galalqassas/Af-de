import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentFeedback.css";

const StudentFeedback = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const studentId = sessionStorage.getItem("student_id"); 
        if (!studentId) {
            setError("Student ID is missing. Please log in again.");
            return;
        }

        fetch(`http://127.0.0.1:5000/student/enrolled-courses?student_id=${studentId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch enrolled courses");
                }
                return response.json();
            })
            .then((data) => setEnrolledCourses(data.courses || []))
            .catch((err) => setError(err.message));
    }, []);

    const handleCourseClick = (courseId) => {
        navigate(`/feedback/${courseId}`); 
    };

    return (
        <div className="feedback-container">
            <h2 className="feedback-title">My Enrolled Courses</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="course-list">
                {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                        <div
                            key={course.course_id}
                            className="course-card"
                            onClick={() => handleCourseClick(course.course_id)}
                        >
                            <div className="course-thumbnail">
                                <img src={course.image_url} alt={course.course_name} />
                            </div>
                            <div className="course-details">
                                <h3>{course.course_name}</h3>
                                <p>{course.course_description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No enrolled courses found.</p>
                )}
            </div>
        </div>
    );
};

export default StudentFeedback;
