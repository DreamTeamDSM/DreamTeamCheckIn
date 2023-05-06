import { loadDatabase, saveDatabase } from "../database.js";

const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

const CHECK_DOCUMENT = "1126HuVhvZ8dSiNW3DRs6nPyIsJtNje4oysBVKkPdJ3c";
const USER_CHECKS_SHEET = "Users";
const GROUP_CHECKS_SHEET = "Groups";

export async function export_data(rideId, onDbExported) {
  console.log("Exporting data to Google Drive for ride", rideId, "...");
  const callback = async (response) => {
    const db = await loadDatabase();

    const token = response.access_token;
    gapi.client.setToken({ access_token: token });

    await exportGroupChecks(db, rideId);
    await exportUserChecks(db, rideId);

    if (onDbExported) {
      onDbExported();
    }

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
  try {
    const newSheetName = `${new Date().toLocaleDateString()} ${GROUP_CHECKS_SHEET}`;
    console.log(`Creating new group export sheet "${newSheetName}"`);

    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: CHECK_DOCUMENT,
      requests: [{
        addSheet: {
          properties: {
            title: newSheetName,
          }
        }
      }],
    });

    const result = db.exec(
      "SELECT Groups.group_name, Stops.description, GroupCheck.check_in, GroupCheck.check_out FROM GroupCheck " +
        "INNER JOIN Groups ON GroupCheck.group_id = Groups.group_id " +
        "INNER JOIN Stops ON GroupCheck.stop_id = Stops.stop_id " +
        "WHERE Groups.ride_id = ?",
      [rideId]
    );

    console.log(
      "Exporting",
      result[0].values.length,
      "group checks",
      result[0].values
    );

    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: CHECK_DOCUMENT,
      range: `'${newSheetName}'!A2:D${result[0].values.length + 1}`,
      valueInputOption: "RAW",
      resource: {
        values: result[0].values,
      },
    });

    console.log("Done pushing to sheets");
  } catch (e) {
    console.log("Error pushing group checks to sheets", e);
  }
}

async function exportUserChecks(db, rideId) {
  try {
    const newSheetName = `${new Date().toLocaleDateString()} ${USER_CHECKS_SHEET}`;
    console.log(`Creating new user export sheet "${newSheetName}"`);

    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: CHECK_DOCUMENT,
      requests: [{
        addSheet: {
          properties: {
            title: newSheetName,
          }
        }
      }],
    });

    const result = db.exec(
      "SELECT Users.first_name, Users.last_name, check_in, check_out FROM GroupAssignments " +
        "INNER JOIN Groups ON GroupAssignments.group_id = Groups.group_id " +
        "INNER JOIN Users ON GroupAssignments.user_id = Users.user_id " +
        "WHERE Groups.ride_id = ?",
      [rideId]
    );

    console.log(
      "Exporting",
      result[0].values.length,
      "user checks",
      result[0].values
    );

    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: CHECK_DOCUMENT,
      range: `'${newSheetName}'!A2:D${result[0].values.length + 1}`,
      valueInputOption: "RAW",
      resource: {
        values: result[0].values,
      },
    });

    console.log("Done pushing to sheets");
  } catch (e) {
    console.log("Error pushing user checks to sheets", e);
  }
}

const saveExport = async (db, ride_id) => {
  db.exec("INSERT INTO RideExports (ride_id) VALUES (?)", [ride_id]);
  await saveDatabase(db);
};
