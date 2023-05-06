const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

export async function export_data(onDbExported) {
  const callback = (response) => {
    const token = response.access_token;
    gapi.client.setToken(token);

    exportChecks();

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

function exportChecks(db) {
  // TODO: write updated checks to sheets
}
