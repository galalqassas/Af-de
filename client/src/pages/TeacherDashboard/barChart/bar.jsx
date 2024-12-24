import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme, CircularProgress } from "@mui/material";

const Bar = ({ isDashboard = false }) => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teacherId = localStorage.getItem('teacher_id');
                const response = await fetch(
                    `http://127.0.0.1:5000/dashboard/assessment-scores?teacher_id=${teacherId}`
                );
                if (!response.ok) throw new Error('Failed to fetch data');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching assessment scores:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ height: isDashboard ? "280px" : "35vh" }}>
            <ResponsiveBar
                data={data}
                keys={["Average Score"]}
                indexBy="assessment"
                theme={{
                    textColor: theme.palette.text.primary,
                    fontSize: 11,
                    axis: {
                        domain: { line: { stroke: theme.palette.divider, strokeWidth: 1 }},
                        ticks: { line: { stroke: theme.palette.divider, strokeWidth: 1 }}
                    },
                    grid: { line: { stroke: theme.palette.divider, strokeWidth: 0.5 }}
                }}
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={{ scheme: "nivo" }}
                defs={[
                    {
                        id: 'gradientA',
                        type: 'linear',
                        colors: [
                            { offset: 0, color: 'inherit' },
                            { offset: 100, color: 'inherit', opacity: 0.6 }
                        ],
                    }
                ]}
                fill={[{ match: '*', id: 'gradientA' }]}
                borderRadius={4}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: isDashboard ? null : "Assessments",
                    legendPosition: "middle",
                    legendOffset: 45
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: isDashboard ? null : "Average Score",
                    legendPosition: "middle",
                    legendOffset: -45
                }}
                enableGridY={true}
                gridYValues={5}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                tooltip={({ id, value, color }) => (
                    <div
                        style={{
                            padding: 12,
                            background: '#ffffff',
                            border: '1px solid #ccc',
                            borderRadius: 4,
                            color: '#333',
                        }}
                    >
                        <strong>{id}</strong>
                        <br />
                        <span>{value.toFixed(2)}%</span>
                    </div>
                )}
                legends={[{
                    dataFrom: "keys",
                    anchor: "bottom-right",
                    direction: "column",
                    translateX: 120,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }]}
                role="application"
                ariaLabel="Assessment scores bar chart"
            />
        </Box>
    );
};

export default Bar;