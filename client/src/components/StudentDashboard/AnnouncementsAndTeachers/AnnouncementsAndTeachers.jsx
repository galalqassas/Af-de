import React, { useEffect, useState } from "react";
import "./AnnouncementsAndTeachers.css";

const AnnouncementsAndTeachers = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const studentId = sessionStorage.getItem("student_id");

    if (!studentId) {
      setError("Student ID not found");
      return;
    }

    fetch(`http://127.0.0.1:5000/announcements_and_teachers?student_id=${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setAnnouncements(data.announcements || []);
        setTeachers(data.teachers || []);
      })
      .catch((error) => setError(error.message));
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="announcements-and-teachers">
      <section className="announcements">
        <h2>Announcements</h2>
        <div className="updates">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div className="announcement-card" key={announcement.notification_id}>
                <div className="announcement-header">
                  <i className="fas fa-bullhorn announcement-icon"></i>
                  <p className="announcement-time">{announcement.created_at}</p>
                </div>
                <div className="announcement-body">
                  <p>{announcement.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No announcements available</p>
          )}
        </div>
      </section>

      <section className="teachers">
        <h2>Your Teachers</h2>
        <div className="teacher-list">
          {teachers.length > 0 ? (
            teachers.map((teacher) => (
              <div className="teacher-card" key={teacher.teacher_id}>
                <img
                  src={teacher.profile_picture}
                  alt={teacher.name}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150?text=No+Image")
                  }
                />
                <div className="info">
                  <h4>{teacher.name}</h4>
                  <small className="text-muted">{teacher.designation || "N/A"}</small>
                </div>
              </div>
            ))
          ) : (
            <p>No teachers found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AnnouncementsAndTeachers;
