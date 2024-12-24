import React, { useEffect, useState } from "react";
import "./Assessments.css";

const Assessments = ({ onStartQuiz }) => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const studentId = sessionStorage.getItem("student_id");
        if (!studentId) {
            setError("Student ID is missing. Please log in again.");
            return;
        }

        fetch(`http://127.0.0.1:5000/student/enrolled-courses?student_id=${studentId}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch enrolled courses");
                return response.json();
            })
            .then((data) => setEnrolledCourses(data.courses || []))
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="assessments-container">
            <h2 className="assessments-title">My Assessments</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="course-list">
                {enrolledCourses.map((course) => (
                    <div
                        key={course.course_id}
                        className="course-card"
                        onClick={() => onStartQuiz(course.course_id)}
                    >
                        <div className="course-thumbnail">
                            <img src={course.image_url || "/default-course.jpg"} alt={course.course_name} />
                        </div>
                        <div className="course-details">
                            <h3>{course.course_name}</h3>
                            <p>{course.course_description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assessments;
