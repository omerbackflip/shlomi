const { google } = require('googleapis');
const { getOAuthClient } = require('../auth/oauth');

async function ensureFolder(folderName, parentId = null) {
  const drive = google.drive({ version: 'v3', auth: getOAuthClient() });
  const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const res = await drive.files.list({ q: query, fields: 'files(id,name)' });

  if (res.data.files.length > 0) return res.data.files[0];

  const fileMetadata = { name: folderName, mimeType: 'application/vnd.google-apps.folder' };
  if (parentId) fileMetadata.parents = [parentId];
  const folder = await drive.files.create({ resource: fileMetadata, fields: 'id,name' });
  return folder.data;
}

module.exports = { ensureFolder };
