import React from "react";
import "./DebugBar.css"; // Import the CSS file for styling
import {
  destroyDatabase,
  loadDatabase,
  saveDatabaseAsFile,
} from "../utils/database";

function DebugBar() {
  const queryParams = new URLSearchParams(location.search);
  const isDebugMode = queryParams.get('debug');

  return isDebugMode && (
    <div className="debug-bar">
      <button
        onClick={() => loadDatabase().then((db) => saveDatabaseAsFile(db))}
      >
        Download DB as File
      </button>
      <button onClick={() => destroyDatabase()}>Destroy DB</button>
    </div>
  );
}

export default DebugBar;
