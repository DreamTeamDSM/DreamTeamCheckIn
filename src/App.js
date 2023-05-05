import React from 'react';
import logo from './logo.svg';
import './App.css';
const database = require('./database');

function App() {
  const handleClick = async () => {
    const db = await database.createDatabase();

    //TODO: Seed data here

    await database.saveDatabase(db);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. live from github actions or something
        </p>
        <button type="button" onClick={handleClick}>
          Initialize + Seed Database!
        </button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
