import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./StudentSidebar.css";

function StudentSidebar({ handleMenuClick }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            sessionStorage.clear();
            window.alert("You have been logged out successfully.");
            navigate("/");
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3 className="brand">
                    <span>SCHOLAR</span>
                </h3>
            </div>
            <ul className="nav-links">
                <li>
                    <a href="#home" className="nav-item" onClick={() => handleMenuClick("home")}>
                        <span className="nav-icon">
                            <i className="fas fa-home"></i>
                        </span>
                        <span>Home</span>
                    </a>
                </li>
                <li>
                    <a href="#courses" className="nav-item" onClick={() => handleMenuClick("courses")}>
                        <span className="nav-icon">
                            <i className="fas fa-book"></i>
                        </span>
                        <span>Courses</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#assessments"
                        className="nav-item"
                        onClick={() => handleMenuClick("assessments")}
                    >
                        <span className="nav-icon">
                            <i className="fas fa-file-alt"></i>
                        </span>
                        <span>Assessments</span>
                    </a>
                </li>
                <li>
                    <a
                        href="#feedback"
                        className="nav-item"
                        onClick={() => handleMenuClick("feedback")}
                    >
                        <span className="nav-icon">
                            <i className="fas fa-comment-dots"></i>
                        </span>
                        <span>Feedback</span> 
                    </a>
                </li>
            </ul>
            <div className="logout">
                <button className="logout-button" onClick={handleLogout}>
                    <span className="nav-icon">
                        <i className="fas fa-sign-out-alt"></i>
                    </span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}

StudentSidebar.propTypes = {
    handleMenuClick: PropTypes.func.isRequired,
};

export default StudentSidebar;
