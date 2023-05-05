const CLIENT_ID =
  "592413971720-1psng6fqdu3dtn9hhvv1und82snfho3i.apps.googleusercontent.com";

export function presentUserForToken(handleToken) {
  const callback = (response) => handleToken(response.access_token);
  const client = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    callback: callback,
    scope: "https://www.googleapis.com/auth/spreadsheets",
  });
  client.requestAccessToken();
}
