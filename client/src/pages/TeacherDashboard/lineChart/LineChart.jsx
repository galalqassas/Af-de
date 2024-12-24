import { Box, useTheme } from "@mui/material";
import React from "react";
import Line from "./Line.jsx";
import DashHeader from "../../../components/TeacherDashboard/DashHeader.jsx";
import DashSideBar from "../../../components/TeacherDashboard/DashSideBar.jsx";

const LineChart = () => {
  const theme = useTheme();
  return (
    <Box>
      <DashHeader title="Line Chart" subTitle="Simple Line Chart" />
      
      <Line />
    </Box>
  );
};

export default LineChart;
