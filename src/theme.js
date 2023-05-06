import React from 'react';
import { createTheme, ThemeProvider as MThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import { lighten, darken } from "polished";

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
            light: lighten(0.1, "#188B54"),
            main: "#188B54",
            dark: darken(0.1, "#188B54"),
            contrastText: "#fff",
        },
        lightBlue: {
            light: lighten(0.1, "#738BB1"),
            main: '#738BB1',
            dark: darken(0.1, "#738BB1"),
            contrastText: "#fff",
        },
        darkBlue: {
            light: lighten(0.1, "#0D2A57"),
            main: "#0D2A57",
            dark: darken(0.1, "#0D2A57"),
            contrastText: "#fff",
        },
        green: {
            light: lighten(0.1, "#188B54"),
            main: '#188B54',
            dark: darken(0.1, "#188B54"),
            contrastText: "#fff",
        },
        white: {
            main: '#fff'
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