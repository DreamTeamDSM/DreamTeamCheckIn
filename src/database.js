const initSqlJs = require("sql.js");

const SQLITE_DB_FILE = "sqlite.db";

export async function destroyDatabase() {
  console.log("Destroying database...");
  const dirHandle = await navigator.storage.getDirectory();
  // eslint-disable-next-line no-unused-vars
  for await (const [key, value] of dirHandle.entries()) {
    console.log("Deleting file: " + key);
    await dirHandle.removeEntry(key);
  }
}

export async function loadDatabase() {
  console.log("Loading database...");

  const dirHandle = await navigator.storage.getDirectory();

  const existingDbFile = await getDatabaseFile(dirHandle);
  if (!existingDbFile) {
    console.log("No existing database found.");
    return null;
  }

  console.log("Existing database found. Loading data...");
  const fileHandle = await dirHandle.getFileHandle(SQLITE_DB_FILE);
  const fileData = await fileHandle.getFile();

  console.log("Reinitializing database from data...");
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const db = new SQL.Database(fileData);

  console.log("Existing database loaded.");

  return db;
}

export async function createDatabase() {
  console.log("Creating new database...");

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const db = new SQL.Database();

  // TODO: initialize schema

  return db;
}

export async function saveDatabase(db) {
  console.log("Saving database...");

  const dirHandle = await navigator.storage.getDirectory();

  var fileHandle = await getDatabaseFile(dirHandle);
  if (!fileHandle) {
    console.log("No existing DB file found. Creating new one.");

    fileHandle = await dirHandle.getFileHandle(SQLITE_DB_FILE, {
      create: true,
    });
  }

  console.log("Serializing database...");
  const binaryArray = db.export();

  console.log("Writing database to file...");
  const writable = await fileHandle.createWritable();
  await writable.write(binaryArray);
  await writable.close();

  console.log("Database saved.");
}

// Returns null if the sqlite DB file doesn't exist.
async function getDatabaseFile(dirHandle) {
  for await (const [key, value] of dirHandle.entries()) {
    if (key === SQLITE_DB_FILE) {
      return value;
    }
  }
  return null;
}
