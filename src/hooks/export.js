import { loadDatabase, saveDatabase } from "../database.js";

const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

const CHECK_DOCUMENT = "1126HuVhvZ8dSiNW3DRs6nPyIsJtNje4oysBVKkPdJ3c";
const USER_CHECKS_SHEET = "Users";
const GROUP_CHECKS_SHEET = "Groups";

export async function export_data(rideId, onDbExported, setLoading) {
  console.log("Exporting data to Google Drive for ride", rideId, "...");
  setLoading(true);
  console.log('set true');
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
    setLoading(false);
    console.log('set false')
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
    console.log(`Upserting group export sheet "${newSheetName}"`);

    await upsertSheet(CHECK_DOCUMENT, newSheetName);

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

    const data = [
      ['Group', 'Stop', 'Check In', 'Check Out'],
      ...result[0].values,
    ];

    const range = `'${newSheetName}'!A1:D${result[0].values.length + 1}`;
    await writeSheetData(CHECK_DOCUMENT, range, data);

    console.log("Done pushing to sheets");
  } catch (e) {
    console.error("Error pushing group checks to sheets", e);
  }
}

async function exportUserChecks(db, rideId) {
  try {
    const newSheetName = `${new Date().toLocaleDateString()} ${USER_CHECKS_SHEET}`;
    console.log(`Upserting user export sheet "${newSheetName}"`);

    await upsertSheet(CHECK_DOCUMENT, newSheetName);

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

    const data = [
      ['First Name', 'Last Name', 'Check In', 'Check Out'],
      ...result[0].values,
    ];

    const range = `'${newSheetName}'!A1:D${result[0].values.length + 1}`;
    await writeSheetData(CHECK_DOCUMENT, range, data);

    console.log("Done pushing to sheets");
  } catch (e) {
    console.error("Error pushing user checks to sheets", e);
  }
}

const saveExport = async (db, ride_id) => {
  db.exec("INSERT INTO RideExports (ride_id) VALUES (?)", [ride_id]);
  await saveDatabase(db);
};

const writeSheetData = async(spreadsheetId, range, values) => {
  try {
    await callGoogleApi(gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: values,
      },
    }));
  } catch (e) {
    throw new Error(`Error writing data to spreadsheet "${spreadsheetId}" range "${range}": ${e}`);
  }
}

const upsertSheet = async (spreadsheetId, sheetName) => {
  try {
    const sheets = await listSheets(spreadsheetId);
    if (sheets.find((s) => s.properties.title === sheetName)) return;

    await callGoogleApi(gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: CHECK_DOCUMENT,
      requests: [{
        addSheet: {
          properties: {
            title: newSheetName,
          }
        }
      }],
    }));
  } catch (e) {
    throw new Error(`Error upserting sheet "${sheetName}": ${e}`);
  }
}

const listSheets = async (spreadsheetId) => {
  try {
    const result = await callGoogleApi(gapi.client.sheets.spreadsheets.get({spreadsheetId: spreadsheetId}));
    return result.result.sheets;
  } catch (e) {
    throw new Error(`Error listing sheets for ${spreadsheetId}: ${e}`);
  }
}

const callGoogleApi = async (callFuture) => {
  var result;
  try {
    result = await callFuture;
  } catch (e) {
    throw new Error(`Error returned from Google API ${JSON.stringify(e)}`);
  }

  if (result?.status !== 200) {
    throw new Error(`Non-200 returned from Google API ${JSON.stringify(result)}`);
  }

  return result;
};
