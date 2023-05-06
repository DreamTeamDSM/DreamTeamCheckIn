import React from "react";
import "./DebugBar.css"; // Import the CSS file for styling
import {
  createDatabase,
  saveDatabase,
  destroyDatabase,
  loadDatabase,
  saveDatabaseAsFile,
  seedDatabase,
  seedDatabase2,
} from "../database.js";
import { importData } from "../hooks/import";
import { getRides, getRideById } from "../hooks/ride";
import { useAppContext } from "../AppContext";


function DebugBar() {
  const context = useAppContext()

  return (
    <div className="debug-bar">
      <button
        onClick={() => loadDatabase().then((db) => saveDatabaseAsFile(db))}
      >
        Download DB as File
      </button>
      <button onClick={() => destroyDatabase()}>Destroy DB</button>
      <button onClick={() => getRides()}>Get Rides</button>
      <button onClick={() => importData(() => console.log("DONE!"))}>
        Perform Import
      </button>
      <button onClick={() => getRideById(12)}>Get Ride 12</button>
    </div>
  );
}

export default DebugBar;
