import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, useTheme } from "@mui/material";
import DashHeader from "../../../components/TeacherDashboard/DashHeader.jsx";

const Course = () => {
  const theme = useTheme();
  const [courseData, setCourseData] = useState([]);
  const teacherId = localStorage.getItem('teacher_id'); 

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/courses?teacher_id=${teacherId}`)
      .then(response => response.json())
      .then(data => {
        const courseRows = data.map(course => ({
          id: course.course_id,
          course_name: course.course_name,
          course_description: course.description,
        }));
        setCourseData(courseRows);
      })
      .catch(error => {
        console.error("There was an error fetching the courses!", error);
      });
  }, [teacherId]);

  // Define columns for DataGrid
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "course_name",
      headerName: "Course Name",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "course_description",
      headerName: "Description",
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
  ];

  return (
    <Box>
      <DashHeader title={"Courses"} subTitle={"Managing the Courses and Instructors"} />

      <Box sx={{ height: 600, mx: "auto" }}>
        <DataGrid
          rows={courseData}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Course;