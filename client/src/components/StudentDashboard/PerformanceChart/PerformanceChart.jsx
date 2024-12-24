import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./PerformanceChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceChart = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const studentId = sessionStorage.getItem("student_id");

        if (!studentId) {
            setError("Student ID not found");
            return;
        }

        fetch(`http://127.0.0.1:5000/student/performance?student_id=${studentId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) throw new Error(data.error);

                // Quiz Scores
                const quizScores = data.quizzes.map((q) => q.score);

                setChartData({
                    labels: ["Quizzes Completed", "Quizzes In Progress"],
                    datasets: [
                        {
                            label: "Quiz Progress",
                            backgroundColor: ["#7c4dff", "#3f51b5"],
                            hoverBackgroundColor: ["#5b35e5", "#2d3aa9"],
                            borderRadius: 8,
                            data: [data.completed_quizzes, data.in_progress_quizzes],
                        },
                    ],
                });
            })
            .catch((err) => setError(err.message));
    }, []);

    if (error) return <div className="performance-error">Error: {error}</div>;
    if (!chartData) return <div className="performance-loading">Loading...</div>;

    return (
        <div className="performance-chart-container">
            <h3 className="performance-chart-title">Performance Overview</h3>
            <div className="performance-chart">
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true, position: "top" },
                        },
                        scales: {
                            y: { beginAtZero: true, ticks: { color: "#555" } },
                            x: { ticks: { color: "#555" } },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default PerformanceChart;
