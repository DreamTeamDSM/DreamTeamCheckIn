import React from "react";
import "./DebugBar.css"; // Import the CSS file for styling
import {
  destroyDatabase,
  loadDatabase,
  saveDatabaseAsFile,
} from "../database.js";
import { importData } from "../hooks/import";
import { getRides, getRideById } from "../hooks/ride";
import { useAppContext } from "../AppContext";
import { export_data } from "../hooks/export";

function DebugBar() {
  const queryParams = new URLSearchParams(location.search);
  const isDebugMode = queryParams.get('debug');
  const { currentRide, refresh } = useAppContext();

  const syncToDrive = () => {
    export_data(currentRide.Ride.ride_id, () => console.log("Exported!"));
    refresh();
  }

  return isDebugMode && (
    <div className="debug-bar">
      <button
        onClick={() => loadDatabase().then((db) => saveDatabaseAsFile(db))}
      >
        Download DB as File
      </button>
      <button onClick={() => destroyDatabase()}>Destroy DB</button>
      <button onClick={() => getRides()}>Get Rides</button>
      <button onClick={() => importData(() => console.log("Imported!"))}>
        Sync FROM Drive
      </button>
      <button onClick={() => syncToDrive()}>
        Sync TO Drive
      </button>
      <button onClick={() => getRideById(12)}>Get Ride 12</button>
    </div>
  );
}

export default DebugBar;
