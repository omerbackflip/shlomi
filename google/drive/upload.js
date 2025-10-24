const fs = require('fs');
const { google } = require('googleapis');
const { getOAuthClient } = require('../auth/oauth');

async function uploadFile(filePath, folderId = null) {
  const drive = google.drive({ version: 'v3', auth: getOAuthClient() });
  const fileMetadata = { name: filePath.split(/[\\/]/).pop() };
  if (folderId) fileMetadata.parents = [folderId];
  const media = { body: fs.createReadStream(filePath) };

  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id,name,webViewLink'
  });
  return res.data;
}

module.exports = { uploadFile };
