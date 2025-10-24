const { google } = require('googleapis');
require('dotenv').config();

let oAuth2Client = null;

function initOAuthClient({
  clientId = process.env.GOOGLE_CLIENT_ID,
  clientSecret = process.env.GOOGLE_CLIENT_SECRET,
  redirectUri = process.env.GOOGLE_REDIRECT_URI
} = {}) {
  oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  return oAuth2Client;
}

function getOAuthClient() {
  if (!oAuth2Client) throw new Error('OAuth2 client not initialized. Call google.init() first.');
  return oAuth2Client;
}

function generateAuthUrl() {
  const client = getOAuthClient();
  const scopes = (process.env.GOOGLE_SCOPES || 'https://www.googleapis.com/auth/drive.file').split(',');
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
}

async function getTokens(code) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  return tokens;
}

module.exports = { initOAuthClient, getOAuthClient, generateAuthUrl, getTokens };
