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

export async function createDatabase(callback) {
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

      if (callback) {
        callback(db);
      }
    })

    // Seed data for UserTypes table
    db.exec(`
      INSERT INTO UserTypes (type) VALUES
      ('Rider'),
      ('Mentor');
    `);

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
  //const buffer = Buffer.from(binaryArray);
  await writable.write(binaryArray);
  await writable.close();

  console.log("Database saved.");
}

export async function saveDatabaseAsFile(db) {
  const binaryArray = db.export();

  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";

  const blob = new Blob([binaryArray], { type: "application/octet-stream" });
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

export async function seedDatabase2(db) {
  // Seed data for UserTypes table
  db.exec(`
    INSERT INTO UserTypes (type) VALUES
    ('Rider'),
    ('Mentor');
  `);

  // Seed data for Users table
  db.exec(`
    INSERT INTO Users (user_id, first_name, last_name, photo_url, user_type_id, active) VALUES
    (1,'John', 'Doe', NULL, 0, 1),
    (2,'Jane', 'Doe', NULL, 0, 1),
    (3,'Bob', 'Smith', NULL, 0, 1),
    (4,'Jamie', 'Smith', NULL, 1, 1),
    (5,'Alice', 'Johnson', NULL, 1, 1),
    (6,'Mike', 'Williams', NULL, 1, 1);
  `);

  // Seed data for Routes table
  db.exec(`
    INSERT INTO Routes (route_name, distance, type, via, climb, hours, difficulty) VALUES
    ('Route 1', 10.2, 'outAndBack', 'Pella Rd', 34, 100, 'Easy'),
    ('Route 2', 7.8, 'Loop', 'Stella Rd', 55, 40, 'Easy'),
    ('Route 3', 14.6, 'outAndBack', 'Another Rd', 66, 44, 'Easy'),
    ('Route 4', 5.1, 'Loop', 'Hairy Rd', 33, 77, 'Easy'),
    ('Route 5', 12.9, 'outAndBack', 'Pizza Rd', 88, 55, 'Medium');
  `);

  // Seed data for Rides table
  db.exec(`
    INSERT INTO Rides (route_id, date) VALUES
    (1, '2023-05-01'),
    (2, '2023-05-01'),
    (3, '2023-05-01'),
    (1, '2023-05-02'),
    (2, '2023-05-02'),
    (3, '2023-05-02'),
    (4, '2023-05-02'),
    (3, '2023-05-03'),
    (5, '2023-05-04');
  `);

  // Seed data for Groups table
  db.exec(`
    INSERT INTO Groups (group_name, ride_id) VALUES
    ('Group 1', 1),
    ('Group 2', 1),
    ('Group 3', 1),
    ('Group 4', 1),
    ('Group 5', 1),
    ('Group 1', 2),
    ('Group 2', 2),
    ('Group 3', 2),
    ('Group 4', 2),
    ('Group 5', 2),
    ('Group 1', 3),
    ('Group 2', 3),
    ('Group 3', 3),
    ('Group 4', 3),
    ('Group 5', 3),
    ('Group 1', 4),
    ('Group 2', 4),
    ('Group 3', 4),
    ('Group 4', 4),
    ('Group 5', 4),
    ('Group 1', 5),
    ('Group 2', 5),
    ('Group 3', 5),
    ('Group 4', 5),
    ('Group 5', 5),
    ('Group 1', 6),
    ('Group 2', 6),
    ('Group 3', 6),
    ('Group 4', 6),
    ('Group 5', 6),
    ('Group 1', 7),
    ('Group 2', 7),
    ('Group 3', 7),
    ('Group 4', 7),
    ('Group 5', 7),
    ('Group 1', 8),
    ('Group 2', 8),
    ('Group 3', 8),
    ('Group 4', 8),
    ('Group 5', 8),
    ('Group 1', 9),
    ('Group 2', 9),
    ('Group 3', 9),
    ('Group 4', 9),
    ('Group 5', 9);
  `);

  // Seed data for GroupAssignments table
  for (let i = 0; i < 45; i++) {
    db.exec(`
      INSERT INTO GroupAssignments (user_id, group_id, check_in, check_out) VALUES
      (0, ` + i + `, 0, 0),
      (2, ` + i + `, 0, 0),
      (3, ` + i + `, 0, 0),
      (4, ` + i + `, 0, 0),
      (5, ` + i + `, 0, 0);
    `);
  }

  db.exec(`
    INSERT INTO Stops (route_id, description, "order")
    VALUES
      (0, "Start point", 1),
      (0, "Water stop", 2),
      (0, "End point", 3),
      (1, "Start point", 1),
      (1, "Water stop", 2),
      (1, "End point", 3),
      (2, "Start point", 1),
      (2, "Rest stop", 2),
      (2, "End point", 3),
      (3, "Start point", 1),
      (3, "Sightseeing spot", 2),
      (3, "End point", 3),
      (4, "Start point", 1),
      (4, "Lunch stop", 2),
      (4, "End point", 3);
  `);

  for (let i = 0; i < 45; i++) {
    db.exec(`
      INSERT INTO GroupCheck (group_id, stop_id, check_in, check_out)
      VALUES
        (` + i + `, 0, 0, 0),
        (` + i + `, 1, 0, 0),
        (` + i + `, 2, 0, 0),
        (` + i + `, 3, 0, 0),
        (` + i + `, 4, 0, 0),
        (` + i + `, 5, 0, 0),
        (` + i + `, 6, 0, 0),
        (` + i + `, 7, 0, 0),
        (` + i + `, 8, 0, 0),
        (` + i + `, 9, 0, 0),
        (` + i + `, 10, 0, 0),
        (` + i + `, 11, 0, 0),
        (` + i + `, 13, 0, 0),
        (` + i + `, 14, 0, 0);
    `);
  }

  db.exec(`
    INSERT INTO RideSupport (user_id, ride_id, type)
    VALUES
      (5, 0, 'Mechanic'),
      (5, 1, 'Mechanic'),
      (5, 2, 'Driver'),
      (5, 3, 'Sweeper'),
      (5, 4, 'Driver'),
      (5, 5, 'Sweeper'),
      (5, 6, 'Mechanic'),
      (5, 7, 'Sweeper'),
      (5, 8, 'Driver');
  `);

}

export async function seedDatabase(db) {
  try {
    // add a couple of user types
    const sqlUserTypes =
      'INSERT INTO UserTypes VALUES (' + 0 + ',"Rider"); \
       INSERT INTO UserTypes VALUES (' + 1 + ',"Mentor");';
    console.log(sqlUserTypes);
    db.exec(sqlUserTypes);

    for (let i = 0; i <= 100; i++) {
      const user_id = i;
      const ride_id = i+10;
      const group_id = i+100;
      const stop_id = i+1000;
      const route_id = i+10000;

      //User
      const firstName = faker.name.firstName(); // Rowan
      const lastName = faker.name.lastName(); // Nikolaus
      const user_type_id = faker.helpers.arrayElement([0,1]);
      const active = faker.helpers.arrayElement([0,1]);

      const sqlUser = "INSERT INTO Users VALUES (" + user_id + ', "' + firstName + '","' + lastName + '","","' + user_type_id + '",' + active + ",0);";
      console.log("Executing:",sqlUser);
      db.exec(sqlUser);

      //Route
      const distance = faker.random.numeric(2);
      const route_type = faker.helpers.arrayElement(['outAndBack','Loop']);
      const route_name = faker.random.word();
      const via = faker.random.word();
      const climb = 100;
      const hours = 44;
      const difficulty = 'Medium';

      const sqlRoute = "INSERT INTO Routes VALUES (" + route_id + ',"' + route_name + '","' + via + '",' + distance + ',' + climb + ',' + hours + ',"' + difficulty + '","' + route_type + '");';
      console.log(sqlRoute);
      db.exec(sqlRoute);

      //Ride
      const ride_date = faker.date.between('2023-01-01', '2023-05-05');

      const sqlRide = "INSERT INTO Rides VALUES (" + ride_id + ',' + route_id + ',"' + ride_date + '");';
      console.log(sqlRide);
      db.exec(sqlRide);

      //Group
      const group_name = faker.random.word();
      const sqlGroup = "INSERT INTO Groups VALUES (" + group_id + ',"' + group_name + '",' + ride_id + ');';
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

export async function createEmptyDatabase() {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });

  const db = new SQL.Database();

  return db;
}