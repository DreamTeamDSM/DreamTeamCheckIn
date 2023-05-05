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
import { import_data } from "../hooks/import";
import { getRides, getRideById } from "../hooks/ride";

function DebugBar() {
  const handleClick = async () => {
    const db = await createDatabase();

    //TODO: Seed data here
    await seedDatabase(db);

    await saveDatabase(db);
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
      <button onClick={() => import_data(() => console.log("DONE!"))}>
        Perform Import
      </button>
      <button onClick={() => getRideById(12)}>Get Ride 12</button>
    </div>
  );
}

export default DebugBar;
