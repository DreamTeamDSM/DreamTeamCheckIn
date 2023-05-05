import React from 'react';
import logo from './logo.svg';
const database = require('./database');

import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import { RideInfo } from './components/RideInfo';


function App() {

  const [riders,setRiders] = React.useState(0);

  const increaseRider = () => {
    setRiders(riders=> riders+1);
  }

  const decreaseRider = () => {
    setRiders(riders=> riders-1);
  }
  const handleClick = async () => {
    const db = await database.createDatabase();

    //TODO: Seed data here

    await database.saveDatabase(db);
  };

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
          <RideInfo riders={riders} increase={increaseRider} decrease={decreaseRider}/>
          <button type="button" onClick={handleClick}>
            Initialize + Seed Database!
          </button>
        </main>
      </Container>
    </ThemeProvider>
  );
}

export default App;
