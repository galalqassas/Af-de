import React, { useEffect, useState } from "react";
import "./PerformanceSummary.css";

const PerformanceSummary = () => {
  const [summary, setSummary] = useState({
    total_courses: 0,
    completed_courses: 0,
    avg_score: 0,
    pending_assessments: 0,
    attendance: 0,
  });

  useEffect(() => {
    const studentId = sessionStorage.getItem("student_id");
    fetch(`http://127.0.0.1:5000/performance_summary?student_id=${studentId}`)
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((error) => console.error("Error fetching summary:", error));
  }, []);

  return (
    <section className="performance-summary">
      <h2>Performance Overview</h2>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Courses</h3>
          <p>{summary.total_courses}</p>
        </div>
        <div className="card">
          <h3>Completed Courses</h3>
          <p>{summary.completed_courses}</p>
        </div>
        <div className="card">
          <h3>Average Score</h3>
          <p>{summary.avg_score}%</p>
        </div>
        <div className="card">
          <h3>Pending Assessments</h3>
          <p>{summary.pending_assessments}</p>
        </div>
        <div className="card">
          <h3>Attendance</h3>
          <p>{summary.attendance}%</p>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSummary;
