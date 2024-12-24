import React from "react";
import { Stack, Box, Typography, IconButton } from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import EventIcon from "@mui/icons-material/Event";
import FileUploadIcon from "@mui/icons-material/UploadFile";
import { useNavigate } from "react-router-dom";
import ActionCard from "./ActionCard.jsx";

const Row2 = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Upload Material",
            description: "upload and share course materials",
            icon: FileUploadIcon,
            bgColor: "#ca0000",
            onClick: () => navigate("/fileupload"),
        },
        {
            title: "Quiz Creation",
            description: "Create and manage your quizzes",
            icon: QuizIcon,
            bgColor: "#1e88e5",
            onClick: () => navigate("/quizCreation"),
        },
        {
            title: "Schedule Sessions",
            description: "Plan and organize your sessions",
            icon: EventIcon,
            bgColor: "#43a047",
            onClick: () => navigate("/calendar"),
        },
        {
            title: "Award Badge",
            description: "Motivate your students with your badges",
            icon: FileUploadIcon,
            bgColor: "#ff9800",
            onClick: () => navigate("/teacher-dashboard/badges"),
        },
    ];

    return (
        <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="center"
            gap={5}
            sx={{ mt: 4 }}
        >
            {actions.map((action, index) => (
                <ActionCard key={index} {...action} />
            ))}
        </Stack>
    );
};

export default Row2;






