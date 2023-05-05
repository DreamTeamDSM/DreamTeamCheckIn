import React from "react";
import {
  createDatabase,
  saveDatabase,
  destroyDatabase,
  loadDatabase,
  saveDatabaseAsFile,
  seedDatabase,
} from "./database.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import { RideInfo } from "./components/RideInfo";
import { Navigation } from "./components/Navigation";
import { presentUserForToken } from "./auth.js";

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
    await seedDatabase(db);

    await saveDatabase(db);
  };

  const mdTheme = createTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
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

  const testAuth = () => {
    presentUserForToken((token) => {
      try {
        console.log("User authenticated. Updating token...", token);
        gapi.client.setToken(token);

        console.log("Fetching data...");
        gapi.client.sheets.spreadsheets.values
          .get({
            spreadsheetId: "1MFzXHNw3-FOAKf0SUVQGXfWOWLCgXOSn_QW8sIu-ZvQ",
            range: "A3:A12",
          })
          .then((response) => {
            console.log("Response!");
            const result = response.result;
            const numRows = result.values ? result.values.length : 0;
            console.log(`${numRows} rows retrieved: `, result.values);
          });
      } catch (err) {
        console.log("Error fetching data: ", err);
      }
    });
  };

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
          <button onClick={() => testAuth()}>Test Auth</button>
        </main>
      </Container>
    </ThemeProvider>
  );
}

export default App;
