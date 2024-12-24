import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import DashHeader from "../../../components/TeacherDashboard/DashHeader.jsx";

const Student = () => {
  const [rows, setRows] = useState([]);
  const teacherId = localStorage.getItem('teacher_id'); 

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
  ];

  useEffect(() => {
    if (teacherId) {
      fetch(`http://127.0.0.1:5000/students?teacher_id=${teacherId}`)
        .then(response => response.json())
        .then(data => {
          setRows(data);
        })
        .catch(error => {
          console.error("There was an error fetching the students!", error);
        });
    } else {
      console.error("Teacher ID is not available.");
    }
  }, [teacherId]);

  return (
    <Box>
      <DashHeader
        title="Students"
        subTitle="List of Student for Future Reference"
      />

      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={rows}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Student;