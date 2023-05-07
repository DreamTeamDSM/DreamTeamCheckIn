import { CLIENT_ID } from '../config';

const getTokenCallback = (callback) => {
    return async (response) => {
        const expirationTime = new Date();
        expirationTime.setSeconds(expirationTime.getSeconds() + response.expires_in);
        localStorage['expirationTime'] = expirationTime.getTime();

        localStorage['accessToken'] = response.access_token;
        gapi.client.setToken({ access_token: response.access_token });

        if (callback) {
            callback(response);
        }
    };
};

const client = google.accounts.oauth2.initTokenClient({
  client_id: CLIENT_ID,
  callback: getTokenCallback(),
  scope: "https://www.googleapis.com/auth/spreadsheets",
});

export const auth = (onAuthenticated, onError) => {
    const expirationTimeStr = localStorage['expirationTime'];
    if (expirationTimeStr) {
        const expirationTime = new Date(parseInt(expirationTimeStr));
        const now = new Date();
        if (now < expirationTime) {
            console.log('Reusing access token. Valid for another', expirationTime.getTime() - now.getTime(), 'ms.');
            gapi.client.setToken({ access_token: localStorage['accessToken'] });
            onAuthenticated();
            return;
        }
    }

    console.log('No previous token or expired. Requesting new token.');
    client.callback = getTokenCallback(onAuthenticated);
    client.error_callback = onError;
    client.requestAccessToken();
};