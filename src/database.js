import { faker } from '@faker-js/faker';

const initSqlJs = require("sql.js");

const SQLITE_DB_FILE = "sqlite.db";

export async function destroyDatabase() {
  console.log("Destroying database...");
  const dirHandle = await navigator.storage.getDirectory();
  // eslint-disable-next-line no-unused-vars
  for await (const [key] of dirHandle.entries()) {
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
  const file = await fileHandle.getFile();
  const fileData = new Uint8Array(await file.arrayBuffer());

  console.log(`Reinitializing database from data (${file.size} bytes)...`);
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

  await fetch('sql/init_db.sql')
    .then(response => response.text())
    .then(data => {
      console.log("Executing create table scripts...");
      db.exec(data);
      console.log("Successfully created db tables!");
    })
    .catch(error => {
      console.error(error);
    });

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

  console.log("Writing database to file (" + binaryArray.length + " bytes)...");
  const writable = await fileHandle.createWritable();
  await writable.write(binaryArray);
  await writable.close();

  console.log("Database saved.");
}

export async function saveDatabaseAsFile(db) {
  const binaryArray = db.export();

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";

  const blob = new Blob(binaryArray, { type: "octet/stream" });
  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.download = new Date().getTime() + "_sqlite.sqlite";
  a.click();

  window.URL.revokeObjectURL(url);
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

export async function seedDatabase(db) {
  try {
    for (let i = 0; i <= 100; i++) {
      const user_id = i;
      const ride_id = i+10;
      const group_id = i+100;
      const stop_id = i+1000;
      const route_id = i+10000;

      //User
      const firstName = faker.name.firstName(); // Rowan
      const lastName = faker.name.lastName(); // Nikolaus
      const type = faker.helpers.arrayElement(['Rider','Support']);
      const active = faker.helpers.arrayElement([0,1]);

      const sqlUser = "INSERT INTO Users VALUES (" + user_id + ', "' + firstName + '","' + lastName + '","","' + type + '",' + active + ");";
      console.log("Executing:",sqlUser);
      db.exec(sqlUser);

      //Route
      const distance = faker.random.numeric(2);
      const route_type = faker.helpers.arrayElement(['outAndBack','Loop']);

      const sqlRoute = "INSERT INTO Routes VALUES (" + route_id + ',' + distance + ',"' + route_type + '");';
      console.log(sqlRoute);
      db.exec(sqlRoute);

      //Ride
      const ride_date = faker.date.between('2023-01-01', '2023-05-05');

      const sqlRide = "INSERT INTO Rides VALUES (" + ride_id + ',' + route_id + ',"' + ride_date + '");';
      console.log(sqlRide);
      db.exec(sqlRide);

      //Group
      const sqlGroup = "INSERT INTO Groups VALUES (" + group_id + ',' + ride_id + ');';
      console.log(sqlGroup);
      db.exec(sqlGroup);

      //GroupAssignment
      const sqlGroupAssignment = "INSERT INTO GroupAssignments (user_id,group_id,check_in,check_out) VALUES (" + user_id + "," + group_id + ',0,0);';
      console.log(sqlGroupAssignment);
      db.exec(sqlGroupAssignment);

      //Stop
      const sqlStop = "INSERT INTO Stops VALUES (" + stop_id + "," + route_id + ',"' + faker.random.words(5) + '",0);';
      console.log(sqlStop);
      db.exec(sqlStop);

      //GroupCheck
      const sqlGroupCheck = "INSERT INTO GroupCheck (group_id,stop_id,check_in,check_out) VALUES (" + group_id + ',' + stop_id + ',0,0);';
      console.log(sqlGroupCheck);
      db.exec(sqlGroupCheck);

      //RideSupport
      const sqlRideSupport = "INSERT INTO RideSupport (user_id, ride_id, type) VALUES (" + user_id + ',' + ride_id + ',"' + 'adslfkj");';
      console.log(sqlRideSupport);
      db.exec(sqlRideSupport);
    }
  } catch (ex) {
    console.log(ex);
  }

  return;
}