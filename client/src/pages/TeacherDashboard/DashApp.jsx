import React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import DashTopBar from "../../components/TeacherDashboard/DashTopBar.jsx";
import DashSideBar from "../../components/TeacherDashboard/DashSideBar.jsx";
import { getDesignTokens } from "./dashboard/theme.jsx";
import Dashboard from "./dashboard/Dashboard.jsx";
import Course from "./course/Course.jsx";
import Students from "./students/Student.jsx";
import Calendar from "./calendar/Calendar.jsx";
import BarChart from "./barChart/BarChart.jsx";
import LineChart from "./lineChart/LineChart.jsx";
import NotFound from "./notFound/NotFound.jsx";
import BadgeAward from "./badge/BadgeAward.jsx";
import "./index.css";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function DashApp() {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState(localStorage.getItem("currentMode") || "light");
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <DashTopBar open={open} handleDrawerOpen={() => setOpen(true)} setMode={setMode} />
        <DashSideBar open={open} handleDrawerClose={() => setOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="./course" element={<Course />} />
            <Route path="./students" element={<Students />} />
            <Route path="./calendar" element={<Calendar />} />
            <Route path="./bar" element={<BarChart />} />
            <Route path="./line" element={<LineChart />} />
            <Route path="*" element={<NotFound />} />
            <Route path="badges" element={<BadgeAward />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

/*commentshhfhh */
