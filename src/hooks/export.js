import { loadDatabase } from "../database.js";

const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

const CHECK_DOCUMENT = '1126HuVhvZ8dSiNW3DRs6nPyIsJtNje4oysBVKkPdJ3c';
const USER_CHECKS_SHEET = 'User Checks';
const GROUP_CHECKS_SHEET = 'Group Checks';

export async function export_data(rideId, onDbExported) {
  console.log("Exporting data to Google Drive for ride", rideId, "...");
  const callback = async (response) => {
    const db = loadDatabase();

    const token = response.access_token;
    gapi.client.setToken(token);

    await exportGroupChecks(db);
    await exportUserChecks(db);

    onDbExported();
  };

  google.accounts.oauth2
    .initTokenClient({
      client_id: CLIENT_ID,
      callback: callback,
      scope: "https://www.googleapis.com/auth/spreadsheets",
    })
    .requestAccessToken();
}

async function exportGroupChecks(db, rideId) {}

async function exportUserChecks(db, rideId) {}
