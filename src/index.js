import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { loadDatabase, createDatabase, saveDatabase } from "./database.js";

async function setupDatabase() {
  var db = await loadDatabase();
  if (!db) {
    console.log("No existing database found. Creating new one...");
    db = await createDatabase();
    await saveDatabase(db);
    console.log("New database saved!");
  } else {
    console.log("Existing database loaded!");
  }

  return db;
}

setupDatabase().then((db) => {
  ReactDOM.render(
    <React.StrictMode>
      <App db={db} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
