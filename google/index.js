const { initOAuthClient, generateAuthUrl, getTokens, getOAuthClient } = require('./auth/oauth');
const { saveTokens, loadTokens } = require('./auth/tokenService');
const { uploadFile } = require('./drive/upload');
const { ensureFolder } = require('./drive/folder');

function init({ clientId, clientSecret, redirectUri } = {}) {
  const client = initOAuthClient({ clientId, clientSecret, redirectUri });

  // ✅ Load existing tokens from file on startup
  const tokens = loadTokens();
  if (tokens) {
    client.setCredentials(tokens);
    console.log("✅ Google OAuth tokens loaded");
  } else {
    console.log("⚠️ No saved Google tokens found; run /api/google/auth first");
  }

  return client;
}

module.exports = {
  init,
  getOAuthClient,
  generateAuthUrl,
  getTokens,
  saveTokens,
  loadTokens,
  uploadFile,
  ensureFolder
};
