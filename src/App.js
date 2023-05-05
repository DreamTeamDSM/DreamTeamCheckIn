import React from 'react';
import logo from './logo.svg';
/*
import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { red } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});
*/

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Container from '@mui/material/Container';
import { RideInfo } from './RideInfo';

import Riders from './components/Riders.js';

function App() {
  const mdTheme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
    }
  });


  /*
    <ThemeProvider theme={theme}>
      <div className="App">
        <Riders />
      </div>
      */

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <header>
          <Typography component="h1" variant="h4" mt={5}
            gutterBottom
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}> {'Dream Team Check-in'}</Typography>
        </header>
        <main>
          <RideInfo />
          <Riders />
        </main>
      </Container>
    </ThemeProvider>
  );
}

export default App;