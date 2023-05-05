import React from "react";
import { createDatabase, saveDatabase, destroyDatabase } from "./database.js";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import { RideInfo } from "./components/RideInfo";
import { Navigation } from "./components/Navigation";

function App(props) {
  const db = props.db;

  const [riderCount, setRiderCount] = React.useState(0);

  const increaseRider = () => {
    setRiderCount((riderCount) => riderCount + 1);
  };

  const decreaseRider = () => {
    setRiderCount((riderCount) => riderCount - 1);
  };

  const handleClick = async () => {
    const db = await createDatabase();

    //TODO: Seed data here

    await saveDatabase(db);
  };

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
      MuiDataGrid: {
        styleOverrides: {
          columnHeaders: {
            backgroundColor: '#EAEAE7'
          }
        }
      },
    }
  });

  const riders = [
    {
      id: 1,
      groupnumber: 1,
      checkin: 0,
      checkout: 0,
      firstname: "Aaron",
      lastname: "Ayala",
      ridertype: "New",
    },
    {
      id: 2,
      groupnumber: 1,
      checkin: 0,
      checkout: 0,
      firstname: "Addison",
      lastname: "Palmer",
      ridertype: "Veteran",
    },
    {
      id: 3,
      groupnumber: 2,
      checkin: 0,
      checkout: 0,
      firstname: "Alayia",
      lastname: "White",
      ridertype: "New",
    },
    {
      id: 4,
      groupnumber: 2,
      checkin: 0,
      checkout: 0,
      firstname: "Alex",
      lastname: "Erickson",
      ridertype: "Mentor",
    },
    {
      id: 5,
      groupnumber: 2,
      checkin: 0,
      checkout: 0,
      firstname: "Peter",
      lastname: "Parker",
      ridertype: "Mentor",
    },
  ];

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />
      <header>
        <Navigation />
      </header>
      <Container maxWidth="lg">
        <main>
          <RideInfo
            riders={riders}
            riderCount={riderCount}
            increase={increaseRider}
            decrease={decreaseRider}
          />
          <button type="button" onClick={handleClick}>
            Initialize + Seed Database!
          </button>
          <button
            onClick={() => loadDatabase().then((db) => saveDatabaseAsFile(db))}
          >
            Download DB as File
          </button>
          <button onClick={() => destroyDatabase()}>Destroy DB</button>
        </main>
      </Container>
    </ThemeProvider>
  );
}

export default App;
