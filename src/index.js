import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import {
  loadDatabase,
  createDatabase,
  saveDatabase,
  destroyDatabase,
} from "./database.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

async function demoDatabase() {
  await destroyDatabase();

  var db = await loadDatabase();
  if (!db) {
    console.log("No existing database found. Creating new one...");
    db = await createDatabase();
    console.log("New database created. Saving...");
    await saveDatabase(db);
    console.log("New database saved!");
  } else {
    console.log("Existing database loaded!");
  }

  console.log("Adding new load...");
  await addLoad(db);

  const loads = await getLoads(db);
  console.log("Loads: ", loads);
}

demoDatabase();
