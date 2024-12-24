import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, useTheme } from "@mui/material";
import Bar from "./bar.jsx";
import DashHeader from "../../../components/TeacherDashboard/DashHeader.jsx";

const BarChart = () => {
  const theme = useTheme();
  return (
    <Box>
      <DashHeader
        title="Bar Chart"
        subTitle="The minimum wage in Germany, France and Spain (EUR/month)"
      />
      <Bar />
    </Box>
  );
};

export default BarChart;
