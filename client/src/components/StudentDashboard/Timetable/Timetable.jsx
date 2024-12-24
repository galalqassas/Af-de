import React, { useEffect, useState } from "react";
import "./Timetable.css";

const Timetable = () => {
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const studentId = sessionStorage.getItem("student_id");

        if (!studentId) {
            setError("Student ID not found in session storage.");
            return;
        }

        fetch(`http://127.0.0.1:5000/student/timetable?student_id=${studentId}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Server Error: ${res.statusText}`);
                return res.json();
            })
            .then((data) => {
                if (data.error) throw new Error(data.error);
                setSessions(Array.isArray(data.timetable) ? data.timetable : []);
            })
            .catch((err) => setError(`Failed to fetch timetable: ${err.message}`));
    }, []);

    return (
        <div className="timetable-container">
            <h2 className="timetable-title">Upcoming Sessions</h2>
            {error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="scrollbar-container">
                    <table className="timetable-table" aria-label="Student Timetable">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Course</th>
                                <th scope="col">Teacher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.length > 0 ? (
                                sessions.map((session, index) => (
                                    <tr key={index}>
                                        <td>{session?.session_date || "N/A"}</td>
                                        <td>{session?.course_name || "N/A"}</td>
                                        <td>{session?.teacher_name || "N/A"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="no-sessions">
                                        No upcoming sessions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Timetable;
