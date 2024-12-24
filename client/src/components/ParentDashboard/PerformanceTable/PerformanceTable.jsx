import React, { useEffect, useState } from "react";
import "./PerformanceTable.css";

const PerformanceTable = ({ childId }) => {
    const [quizData, setQuizData] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (childId) {
            fetch(`http://127.0.0.1:5000/student/progress?student_id=${childId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch quiz progress");
                    }
                    return response.json();
                })
                .then((data) => setQuizData(data.progress || [])) 
                .catch((err) => setError(err.message));
        }
    }, [childId]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="performance-table">
            <h2>Performance Overview</h2>
            <table>
                <thead>
                    <tr>
                        <th>Quiz Title</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Completion Date</th>
                    </tr>
                </thead>
                <tbody>
                    {quizData.length > 0 ? (
                        quizData.map((quiz, index) => (
                            <tr key={index}>
                                <td>{quiz.quiz_title}</td>
                                <td>{quiz.current_score}</td>
                                <td
                                    className={
                                        quiz.status === "completed"
                                            ? "status-completed"
                                            : "status-in-progress"
                                    }
                                >
                                    {quiz.status}
                                </td>
                                <td>{quiz.completion_date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No quiz data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PerformanceTable;
