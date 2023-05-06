import { loadDatabase, saveDatabase } from "../database.js";

const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

const CHECK_DOCUMENT = '1126HuVhvZ8dSiNW3DRs6nPyIsJtNje4oysBVKkPdJ3c';
const USER_CHECKS_SHEET = 'User Checks';
const GROUP_CHECKS_SHEET = 'Group Checks';

export async function export_data(rideId, onDbExported) {
  console.log("Exporting data to Google Drive for ride", rideId, "...");
  const callback = async (response) => {
    const db = await loadDatabase();

    const token = response.access_token;
    gapi.client.setToken(token);

    await exportGroupChecks(db, rideId);
    await exportUserChecks(db);

    onDbExported();

    await saveExport(db, rideId);
  };

  google.accounts.oauth2
    .initTokenClient({
      client_id: CLIENT_ID,
      callback: callback,
      scope: "https://www.googleapis.com/auth/spreadsheets",
    })
    .requestAccessToken();
}

async function exportGroupChecks(db, rideId) {
  getGroupChecks(db, rideId);
}

async function exportUserChecks(db, rideId) {}

function getGroupChecks(db, rideId) {
  const result = db.exec(
    "SELECT Groups.group_name, Stops.description, check_in, check_out FROM GroupCheck " +
    "INNER JOIN Groups ON GroupCheck.group_id = Groups.group_id " +
    "INNER JOIN Stops ON GroupCheck.stop_id = Stops.stop_id " +
    "WHERE Groups.ride_id = ?",
    [rideId],
  );

  console.log('Group checks:', result);
}

const saveExport = async (db, ride_id) => {
  db.exec("INSERT INTO RideExports (ride_id) VALUES (?)", [ride_id]);
  await saveDatabase(db);
}
