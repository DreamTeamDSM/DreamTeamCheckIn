import { createDatabase, loadDatabase } from "../database";

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

const import_users = (importedDb) => {
  //import user data here
  //no parent dependencies
  // TODO: source of truth is currently phpBB?
};

const import_routes = (importedDb) => {
  //import routes and stops here
  //no parent dependencies, add routes before stops
  // TODO: new source of truth in sheets?
};

const import_ride_support = (importedDb) => {
  //import ride support list here (this was not available in group sheet)
  //need users first, will have to match on name or id if available
  // TODO: new source of truth in sheets?
};

const import_groups = (importedDb) => {
  //will have to create the group, then group assignments
  //need users first
  // TODO: pull from existing structure?
};

export async function import_data(handleImportedDb) {
  const importedDb = await createDatabase();

  const callback = (response) => {
    const token = response.access_token;
    gapi.client.setToken(token);

    import_users(importedDb);
    import_routes(importedDb);
    import_ride_support(importedDb);
    import_groups(importedDb);

    handleImportedDb(importedDb);
  };

  google.accounts.oauth2
    .initTokenClient({
      client_id: CLIENT_ID,
      callback: callback,
      scope: "https://www.googleapis.com/auth/spreadsheets",
    })
    .requestAccessToken();
}

const trigger_import = () => {
  if (!isSynced())
    return "Error: You have not exported all changed data. Triggering an import erases app data. Please export all data before importing.";
  //   backup();
  import_data();
};
