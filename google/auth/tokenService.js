const fs = require('fs');
const path = require('path');
const TOKEN_PATH = path.join(process.cwd(), 'google_token.json');

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('✅ Google tokens saved to', TOKEN_PATH);
}

function loadTokens() {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  return JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
}

module.exports = { saveTokens, loadTokens, TOKEN_PATH };
