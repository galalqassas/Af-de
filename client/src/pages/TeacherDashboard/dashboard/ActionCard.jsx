import {Box, Typography} from "@mui/material";
import React from "react";

const ActionCard = ({ onClick, bgColor, icon: Icon, title, description }) => (
    <Box
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 460,
            height: 350,
            backgroundColor: bgColor,
            color: "white",
            borderRadius: 2,
            cursor: "pointer",
            boxShadow: 4,
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
        }}
        onClick={onClick}
    >
        <Icon sx={{ fontSize: 120 }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
            {title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
            {description}
        </Typography>
    </Box>
);

export default ActionCard;