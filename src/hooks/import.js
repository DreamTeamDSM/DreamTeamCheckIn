import { createDatabase, loadDatabase, saveDatabase } from "../database";

const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

const isSynced = () => {
  //do not allow import if we have more recent changes to GroupAssignment or GroupCheck since last RideExport
  const db = loadDatabase();
  let isSynced = true;

  //get latest export for each ride
  const latest_exports = db.exec(
    "SELECT TOP 1 ride_id, created_at FROM RideExport GROUP BY ride_id ORDER BY created_at DESC"
  );

  //get group assignments for each group ride where updated at is greater than last ride export
  latest_exports.values.array.forEach((latest_export) => {
    const not_exported_assignments = db.exec(
      `SELECT * from GroupAssignment WHERE group_id IN (SELECT group_id FROM Group WHERE ride_id = ${latest_export[0]}) AND updated_at > (${latest_export[created_at]})`
    );
    if (not_exported_assignments.length() > 0) isSynced = false;
  });

  //select group check for each ride where updated at is greater than last ride export
  latest_exports.values.array.forEach((latest_export) => {
    const not_exported_group_checks = db.exec(
      `SELECT * FROM GroupCheck WHERE group_id IN (SELECT group_id from Group where ride_id = ${latest_export[0]}) AND updated_at > (${latest_export[created_at]})`
    );
    if (not_exported_group_checks.length() > 0) isSynced = false;
  });

  //if any of the above is not zero... tell user which rides have not been exported or just false for now....
  return isSynced;

  /* example output from db.exec
  [
    {columns:['a','b'], values:[[0,'hello'],[1,'world']]}
  ]
  */
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
      range: "'Users'!A:F",
    })
    .then((response) => {
      const result = response.result;
      for (const row of result.values) {
        // Skip header row
        if (row[0] === "ID") {
          continue;
        }

        importedDb.run("INSERT INTO Users VALUES (?, ?, ?, ?, ?, ?)", [
          row[0],
          row[1],
          row[2],
          "",
          row[3],
          row[4],
        ]);
      }
    });
};

const import_routes = async (importedDb) => {
  const routes = (await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: USER_ROUTE_SPREADSHEET_ID,
    range: "'Routes'!A:D",
  })).result;

  for (const row of routes.values) {
    // Skip header row
    if (row[0] === "ID") {
      continue;
    }

    console.log("Route row ", row);

    importedDb.run("INSERT INTO Routes VALUES (?, ?, ?, ?)", [
      row[0],
      row[1],
      row[2],
      row[3],
    ]);
  }

  const stops = (await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: USER_ROUTE_SPREADSHEET_ID,
    range: "'Stops'!A:C",
  })).result;

  for (const row of stops.values) {
    // Skip header row
    if (row[0] === "ID") {
      continue;
    }

    console.log("Stop row ", row);

    importedDb.run("INSERT INTO Stops VALUES (?, ?, ?, ?)", [
      parseInt(row[1]),
      parseInt(row[0]),
      row[2],
      0,
    ]);
  }
};

const import_groups = (importedDb) => {
  //will have to create the group, then group assignments
  //need users first
  // TODO: pull from existing structure?
};

export async function importData(handleImportedDb) {
  await createDatabase((importedDb) => {
    const callback = (response) => {
      const token = response.access_token;
      gapi.client.setToken(token);

      import_users(importedDb);
      import_routes(importedDb);
      import_groups(importedDb);

      saveDatabase(importedDb);
      handleImportedDb(importedDb);
    };

    google.accounts.oauth2
      .initTokenClient({
        client_id: CLIENT_ID,
        callback: callback,
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
