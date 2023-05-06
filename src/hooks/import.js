import { createDatabase, loadDatabase, saveDatabase } from "../database";

const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

  export const isSynced = async () => {
    //do not allow import if we have more recent changes to GroupAssignment or GroupCheck since last RideExport
    const db = await loadDatabase();
    let isSynced = true;

    //get latest export for each ride
    const latestExports = db.exec(
      "SELECT ride_id, date FROM RideExports GROUP BY ride_id ORDER BY date DESC LIMIT 1"
    )[0];

    //get group assignments for each group ride where updated at is greater than last ride export
    if(!latestExports?.values?.length) return false;

    latestExports.values.forEach((latestExport) => {
      const notExportedAssignments = db.exec(
        `SELECT * from GroupAssignments WHERE group_id IN (SELECT group_id FROM Groups WHERE ride_id = ${latestExport[0]}) AND update_date > '${latestExport[1]}'`
      );
      console.log(notExportedAssignments);
      if (notExportedAssignments.length > 0) isSynced = false;
    });

    //select group check for each ride where updated at is greater than last ride export
    latestExports.values.forEach((latestExport) => {
      const notExportedGroupChecks = db.exec(
        `SELECT * FROM GroupCheck WHERE group_id IN (SELECT group_id FROM Groups WHERE ride_id = ${latestExport[0]}) AND update_date > '${latestExport[1]}'`
      );
      console.log(notExportedGroupChecks);
      if (notExportedGroupChecks.length > 0) isSynced = false;
    });

    //if any of the above is not zero... tell user which rides have not been exported or just false for now....
    return isSynced;

  };

const backup = () => {
  //save the current db file.. just incase. do we save this db file locally and just rename? or push it up to google? or both?
};

const USER_ROUTE_SPREADSHEET_ID =
  "1imhKCBAr6SbfcvMs_I3hqQHPCZxHANd7x0mFehFSleA";

const import_users = (importedDb) => {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: USER_ROUTE_SPREADSHEET_ID,
      range: "'Users'!A:G",
    })
    .then((response) => {
      const result = response.result;
      for (const row of result.values) {
        // Skip header row
        if (row[0] === "ID") {
          continue;
        }

        const userTypeId = getUserTypeIdByName(importedDb, row[4]);
        if (!userTypeId) {
          console.error(`User type ${row[4]} not found`);
          continue;
        }

        importedDb.run("INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?, ?)", [
          row[0],
          row[1],
          row[2],
          "NULL", // TODO: row[3]
          userTypeId,
          row[5],
          row[6],
        ]);
      }
    });
};

const import_routes = async (importedDb) => {
  const routes = (
    await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: USER_ROUTE_SPREADSHEET_ID,
      range: "'Routes'!A:H",
    })
  ).result;

  for (var i = 1; i < routes.values.length; i++) {
    const row = routes.values[i];

    importedDb.run("INSERT INTO Routes VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
      row[6],
      row[7],
    ]);
  }

  const stops = (
    await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: USER_ROUTE_SPREADSHEET_ID,
      range: "'Stops'!A:C",
    })
  ).result;

  for (var i = 1; i < stops.values.length; i++) {
    const row = stops.values[i];

    importedDb.run("INSERT INTO Stops VALUES (?, ?, ?, ?)", [
      parseInt(row[1]),
      parseInt(row[0]),
      row[2],
      0,
    ]);
  }

  return stops.values;
};

const GROUP_SPREADSHEET_ID = "1gsbV8BB5H9XpjgTmy-pOy4h7xp2209p_rH8vFk5mNLQ";
const SPREADSHEET_HEADER_ROW_COUNT = 2;
const GROUP_ROW_COUNT = 3;
const GROUP_ROW_SPACING = 11;
const GROUP_COLUMN_COUNT = 5;

const import_groups = async (importedDb, stops) => {
  const spreadsheet = (
    await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: GROUP_SPREADSHEET_ID,
    })
  ).result;
  const sheetNames = spreadsheet.sheets.map((sheet) => sheet.properties.title);

  for (const sheetName of sheetNames) {
    console.log("Importing sheet ", sheetName);

    const rows = (
      await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: GROUP_SPREADSHEET_ID,
        range: `${sheetName}!A:F`, // todo: can't handle spaces
      })
    ).result.values;

    const iterateRange = (startRow, stopRow, startCol, stopCol, fn) => {
      for (let row = startRow; row <= Math.min(rows.length - 1, stopRow); row++) {
        for (let col = startCol; col <= Math.min(rows[row].length - 1, stopCol); col++) {
          fn(rows[row][col], row, col);
        }
      }
    };

    const title = rows[0][0].split(" - ");
    const date = new Date(title[0]);
    const routeName = title[1];

    const matchingRouteId = getRouteIdByName(importedDb, routeName);
    if (!matchingRouteId) {
      // todo: better error feedback?
      console.error(`No matching route for ${routeName}`);
      continue;
    }

    const filteredStops = [];
    for (var i = 1; i < stops.length; i++) {
      if (parseInt(stops[i][0]) === matchingRouteId) {
        filteredStops.push(stops[i]);
      }
    }

    const rideId = createRide(importedDb, matchingRouteId, new Date(date).toLocaleDateString());
    for (var groupRow = 0; groupRow < GROUP_ROW_COUNT; groupRow++) {
      const headerRowIndex = SPREADSHEET_HEADER_ROW_COUNT + groupRow * GROUP_ROW_SPACING;
      const headerRow = rows[headerRowIndex];

      for (var groupCol = 0; groupCol < GROUP_COLUMN_COUNT; groupCol++) {
        const headerValue = headerRow[groupCol];
        if (!headerValue || headerValue.length === 0) {
          continue;
        }

        const iterateGroupUsers = (fn) =>
          iterateRange(
            headerRowIndex + 1,
            headerRowIndex + GROUP_ROW_SPACING,
            groupCol,
            groupCol,
            fn
          );

        if (headerValue.indexOf("Group") > -1) {
          const groupId = createGroup(importedDb, headerValue, rideId);
          for (const stop in filteredStops) {
            createGroupCheck(importedDb, groupId, stop[0]);
          }

          iterateGroupUsers((cell) => {
            if (!cell || cell.length === 0) return;

            const userId = getUserIdByName(importedDb, cell);
            if (!userId) {
              console.error(`No matching user "${cell}" for rider/mentor assignment in group ${headerValue}`);
              return;
            }

            createGroupAssignment(importedDb, userId, groupId);
          });
        } else if (
          headerValue.indexOf("Support") > -1 ||
          headerValue.indexOf("Sweep") > -1
        ) {
          iterateGroupUsers((cell) => {
            if (!cell || cell.length === 0) return;

            const userId = getUserIdByName(importedDb, cell);
            if (!userId) {
              console.error(`No matching user "${cell}" for support assignment in in group ${headerValue}`);
              return;
            }

            createSupportAssignment(importedDb, userId, rideId, headerValue);
          });
        }
      }
    }
  }
};

export async function importData(handleImportedDb, setLoading = () => { }, setError = () => { }) {
  await createDatabase((importedDb) => {
    const callback = async (response) => {
      try {
        if (response.error) {
          setError(response.error)
          setLoading(false)
          return
        }

        const token = response.access_token;
        gapi.client.setToken(token);

        console.log('Performing import...');
        await import_users(importedDb);
        const stops = await import_routes(importedDb);
        console.log('Stops 2', stops);
        await import_groups(importedDb, stops);

        console.log('Saving imported database...');
        saveDatabase(importedDb);

        await handleImportedDb(importedDb);
      } catch (err) {
        console.error(err)
        setError(err)
      } finally {
        setLoading(false)
      }
    };

    const errorCallback = async (response) => {
      setError(response)
      setLoading(false)
    }

    google.accounts.oauth2
      .initTokenClient({
        client_id: CLIENT_ID,
        callback: callback,
        error_callback: errorCallback,
        scope: "https://www.googleapis.com/auth/spreadsheets",
      })
      .requestAccessToken();
  });
}

export const triggerImport = () => {
  if (!isSynced())
    return "Error: You have not exported all changed data. Triggering an import erases app data. Please export all data before importing.";
  //   backup();
  import_data();
};

function getRouteIdByName(db, routeName) {
  const result = db.exec("SELECT * FROM Routes WHERE route_name = ?", [
    routeName,
  ]);

  if (result.length === 0) return null;
  if (result[0].values.length === 0) return null;
  if (result[0].values[0].length === 0) return null;

  return result[0].values[0][0];
}

function createRide(db, routeId, date) {
  db.run("INSERT INTO Rides (route_id, date) VALUES (?, ?)", [routeId, date]);
  return db.exec("SELECT last_insert_rowid()")[0].values[0][0];
}

function createGroup(db, name, rideId) {
  db.run("INSERT INTO Groups (group_name, ride_id) VALUES (?, ?)", [name, rideId]);
  return db.exec("SELECT last_insert_rowid()")[0].values[0][0];
}

function createGroupAssignment(db, userId, groupId) {
  db.run(
    "INSERT INTO GroupAssignments (user_id, group_id, check_in, check_out) VALUES (?, ?, ?, ?)",
    [userId, groupId, 0, 0]
  );
}

function createGroupCheck(db, groupId, stopId) {
  db.run(
    "INSERT INTO GroupCheck (group_id, stop_id, check_in, check_out) VALUES (?, ?, ?, ?)",
    [groupId, stopId, 0, 0]
  );
}

function createSupportAssignment(db, userId, rideId, type) {
  db.run("INSERT INTO RideSupport (user_id, ride_id, type) VALUES (?, ?, ?)", [
    userId,
    rideId,
    type,
  ]);
}

function getUserIdByName(db, fullName) {
  const result = db.exec(
    "SELECT * FROM Users WHERE first_name || ' ' || last_name = ?",
    [fullName]
  );

  if (result.length === 0) return null;
  if (result[0].values.length === 0) return null;
  if (result[0].values[0].length === 0) return null;

  return result[0].values[0][0];
}

function getUserTypeIdByName(db, name) {
  const result = db.exec("SELECT * FROM UserTypes WHERE type = ?", [name]);

  if (result.length === 0) return null;
  if (result[0].values.length === 0) return null;
  if (result[0].values[0].length === 0) return null;

  return result[0].values[0][0];
}
