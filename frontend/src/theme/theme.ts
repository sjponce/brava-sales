import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: "#ffffff",
            paper: "#f2f5f9",
        },
        info: {
            main: "#ffffff",
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#111936",
            paper: "#1a223f",
        },
        info: {
            main: "#212946",
        }
    },
});