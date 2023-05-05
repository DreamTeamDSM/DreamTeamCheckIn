import React from "react";
import "./DebugBar.css"; // Import the CSS file for styling
import {
  createDatabase,
  saveDatabase,
  destroyDatabase,
  loadDatabase,
  saveDatabaseAsFile,
  seedDatabase,
} from "../database.js";
import { getRides } from "../hooks/ride";

function DebugBar() {
  const handleClick = async () => {
    const db = await createDatabase();

    //TODO: Seed data here
    await seedDatabase(db);

    await saveDatabase(db);
  };

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
    <div className="debug-bar">
      <button type="button" onClick={handleClick}>
        Initialize + Seed Database!
      </button>
      <button
        onClick={() => loadDatabase().then((db) => saveDatabaseAsFile(db))}
      >
        Download DB as File
      </button>
      <button onClick={() => destroyDatabase()}>Destroy DB</button>
      <button onClick={() => getRides()}>Get Rides</button>
      <button onClick={() => testAuth()}>Test Auth</button>
    </div>
  );
}

export default DebugBar;
