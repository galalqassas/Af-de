import React, { useState, useEffect } from "react";
import ParentHeader from "../../components/ParentDashboard/ParentHeader/ParentHeader";
import PerformanceTable from "../../components/ParentDashboard/PerformanceTable/PerformanceTable";
import PerformanceCharts from "../../components/ParentDashboard/PerformanceCharts/PerformanceCharts";
import "./ParentDashboard.css";
import Footer from "../../components/LandingPage/Footer/Footer";

const ParentDashboard = () => {
    const [selectedChild, setSelectedChild] = useState(null);
    const [children, setChildren] = useState([]);
    const [quizData, setQuizData] = useState([]);

    useEffect(() => {
        const parentId = sessionStorage.getItem("parent_id");
        if (parentId) {
            fetch(`http://127.0.0.1:5000/parent/children?parent_id=${parentId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch children data");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.children && data.children.length > 0) {
                        setChildren(data.children);
                        setSelectedChild(data.children[0].id);
                    }
                })
                .catch((err) => console.error("Error fetching children:", err));
        }
    }, []);

    useEffect(() => {
        if (selectedChild) {
            fetch(`http://127.0.0.1:5000/student/progress?student_id=${selectedChild}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch quiz progress");
                    }
                    return response.json();
                })
                .then((data) => setQuizData(data.progress || []))
                .catch((err) => console.error("Error fetching quiz progress:", err));
        }
    }, [selectedChild]);

    const handleChildSelect = (childId) => {
        setSelectedChild(childId);
    };

    return (
        <div className="parent-dashboard">
            <ParentHeader onChildSelect={handleChildSelect} />
            <div className="content">
                {selectedChild && (
                    <>
                        <PerformanceTable childId={selectedChild} />
                        <div className="performance-charts">
                            <PerformanceCharts data={quizData} />
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ParentDashboard;
