import React, { useEffect, useState } from "react";
import "./DisplayTeachers.css";

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/teachers")
            .then((response) => response.json())
            .then((data) => setTeachers(data))
            .catch((error) => console.error("Error fetching teachers:", error));
    }, []);

    return (
        <section className="team section" id="team"> 
            <div className="container">
                <h2 className="team-title">Teachers</h2>
                <div className="row">
                    {teachers.map((teacher) => (
                        <div className="col-lg-3 col-md-6" key={teacher.teacher_id}>
                            <div className="team-member">
                                <div className="main-content">
                                    <img
                                        src={teacher.profile_picture}
                                        alt={teacher.name}
                                        onError={(e) =>
                                            (e.target.src =
                                                "https://via.placeholder.com/220?text=No+Image")
                                        }
                                    />
                                    <span className="category">{teacher.designation}</span>
                                    <h4>{teacher.name}</h4>
                                    <ul className="social-icons">
                                        <li>
                                            <a href={teacher.facebook_url} target="_blank" rel="noreferrer">
                                                <i className="fab fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={teacher.twitter_url} target="_blank" rel="noreferrer">
                                                <i className="fab fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={teacher.linkedin_url} target="_blank" rel="noreferrer">
                                                <i className="fab fa-linkedin"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Teachers;
