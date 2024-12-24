// Theme.jsx
import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
        primary: {
          main: purple[500],
          light: purple[300],
          dark: purple[700],
        },
        }
      : {
          primary: {
            main: purple[400],
            light: purple[200],
            dark: purple[600],
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
        }),
  },
});