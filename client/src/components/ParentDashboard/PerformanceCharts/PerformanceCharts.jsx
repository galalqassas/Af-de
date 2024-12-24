import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PerformanceCharts = ({ data }) => {
    const [barChartData, setBarChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);

    useEffect(() => {
        console.log("Received data for charts:", data); 
        if (data && data.length > 0) {
            const quizTitles = data.map((item) => item.quiz_title);
            const scores = data.map((item) => item.current_score);
    
            setBarChartData({
                labels: quizTitles,
                datasets: [
                    {
                        label: "Score",
                        data: scores,
                        backgroundColor: "rgba(124, 77, 255, 0.8)",
                        borderColor: "rgba(124, 77, 255, 1)",
                        borderWidth: 1,
                    },
                ],
            });
    
            setPieChartData({
                labels: ["Completed", "In Progress"],
                datasets: [
                    {
                        data: [
                            data.filter((item) => item.status === "completed").length,
                            data.filter((item) => item.status === "in_progress").length,
                        ],
                        backgroundColor: ["#28a745", "#ffc107"],
                    },
                ],
            });
        }
    }, [data]);
    

    if (!data || data.length === 0) {
        return <p>No quiz data available for charts.</p>;
    }

    return (
        <div className="performance-charts">
            {barChartData && (
                <div className="chart-container">
                    <Bar
                        data={barChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: true, position: "top" },
                            },
                        }}
                    />
                </div>
            )}
            {pieChartData && (
                <div className="chart-container">
                    <Pie
                        data={pieChartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { display: true, position: "top" },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default PerformanceCharts;
