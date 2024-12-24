import React, { useState, useEffect } from "react";
import "./StudentGreeting.css";

const StudentGreeting = () => {
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const studentId = sessionStorage.getItem("student_id");

    if (!studentId) {
      setStudentName("Student");
      return;
    }

    fetch(`http://127.0.0.1:5000/studentname?student_id=${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch student name");
        }
        return response.json();
      })
      .then((data) => setStudentName(data.student_name))
      .catch(() => setStudentName("Student")); 
  }, []);

  return (
    <div className="greeting">
      <div className="container">
        <div className="greeting-card">
          <h3>Hello, {studentName}!</h3>
          <p>We're glad to have you on Scholar!</p>
        </div>
      </div>
    </div>
  );
};

export default StudentGreeting;
