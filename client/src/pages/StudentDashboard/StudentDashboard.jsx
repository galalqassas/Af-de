import React, { useState } from "react";
import StudentSidebar from "../../components/StudentDashboard/StudentSidebar/StudentSidebar";
import StudentGreeting from "../../components/StudentDashboard/StudentGreeting/StudentGreeting";
import StudentEnrollCourses from "../../components/StudentDashboard/StudentEnrollCourses/StudentEnrollCourses";
import AnnouncementsAndTeachers from "../../components/StudentDashboard/AnnouncementsAndTeachers/AnnouncementsAndTeachers";
import PerformanceChart from "../../components/StudentDashboard/PerformanceChart/PerformanceChart";
import StudentFeedback from "../../components/StudentDashboard/StudentFeedback/StudentFeedback";
import Timetable from "../../components/StudentDashboard/Timetable/Timetable";
import Assessments from "../../components/StudentDashboard/Assessments/Assessments";
import Quiz from "../../components/StudentDashboard/Quiz/Quiz";

function StudentDashboard() {
    const [activeMenu, setActiveMenu] = useState("home");
    const [selectedCourseId, setSelectedCourseId] = useState(null); // Store selected course for assessments

    // Handle menu selection
    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        setSelectedCourseId(null); // Reset courseId when switching menus
    };

    // Handle starting a quiz for a specific course
    const handleStartQuiz = (courseId) => {
        setSelectedCourseId(courseId);
        setActiveMenu("quiz");
    };

    return (
        <div className="student-dashboard">
            {/* Sidebar Navigation */}
            <StudentSidebar handleMenuClick={handleMenuClick} />

            {/* Main Content Section */}
            <div className="main-content">
                {activeMenu === "home" && (
                    <div>
                        <StudentGreeting />
                        <PerformanceChart />
                        <Timetable />
                        <AnnouncementsAndTeachers />
                    </div>
                )}

                {activeMenu === "courses" && <StudentEnrollCourses />}

                {activeMenu === "assessments" && (
                    <Assessments onStartQuiz={handleStartQuiz} />
                )}

                {activeMenu === "feedback" && <StudentFeedback />}

                {/* Display Quiz if a Course is Selected */}
                {activeMenu === "quiz" && selectedCourseId ? (
                    <Quiz courseId={selectedCourseId} />
                ) : (
                    activeMenu === "quiz" && (
                        <p className="error-message">No course selected. Please select a course from Assessments.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;
