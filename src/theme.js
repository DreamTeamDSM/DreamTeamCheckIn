import React from 'react';
import { createTheme, ThemeProvider as MThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';

const mdTheme = createTheme({
    palette: {
        background: {
            default: '#F9F9F9',
            paper: '#fff'
        },
        primary: {
            light: "#849CC2",
            main: "#4C6285",
            dark: "#002884",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff7961",
            main: "#f44336",
            dark: "#ba000d",
            contrastText: "#000",
        },
        typography: {
            fontFamily: 'Inter',
        },
    },
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    backgroundColor: '#fff'
                }
            }
        },
        MuiDataGrid: {
            styleOverrides: {
                columnHeaders: {
                    backgroundColor: '#EAEAE7',
                },
                columnHeaderTitle: {
                    fontWeight: 800
                }
            }
        },
    }
});

const ThemeProvider = ({ children }) => {
    return (
        <MThemeProvider theme={mdTheme}>
            <CssBaseline />
            {children}
        </MThemeProvider>
    )
}

export { ThemeProvider }