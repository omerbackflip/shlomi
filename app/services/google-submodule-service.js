const path = require('path');
const fs = require('fs');
const { ServerApp } = require('../config/constants');

const {
  createOAuthClient,
  createFileTokenStore,
  uploadFile
} = require('../../google/backend');

const tokenStore = createFileTokenStore(
  path.join(__dirname, '../config/token.json')
);

function getOAuthClientFromStoredTokens() {
  const oAuth2Client = createOAuthClient({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
  });

  const tokens = tokenStore.load();

  if (!tokens) {
    throw new Error('Google is not connected');
  }

  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

function getMimeTypeByFileName(filename) {
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.xlsx') {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  if (ext === '.zip') {
    return 'application/zip';
  }

  if (ext === '.png') {
    return 'image/png';
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    return 'image/jpeg';
  }

  if (ext === '.pdf') {
    return 'application/pdf';
  }

  return 'application/octet-stream';
}

async function uploadFileToDrive(filePath, folderId) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  if (!folderId) {
    throw new Error('folderId is required');
  }

  const oAuth2Client = getOAuthClientFromStoredTokens();
  const filename = path.basename(filePath);

  const file = await uploadFile({
    oAuth2Client,
    name: filename,
    mimeType: getMimeTypeByFileName(filename),
    body: fs.createReadStream(filePath),
    folderId
  });

  return file;
}

async function uploadBackupExcelToDrive(filename) {
  const filePath = path.join(ServerApp.uploadFolderPath, filename);
  const folderId = process.env.BACKUP_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('BACKUP_DRIVE_FOLDER_ID is missing in .env');
  }

  return uploadFileToDrive(filePath, folderId);
}

module.exports = {
  uploadBackupExcelToDrive,
  uploadFileToDrive,
  getOAuthClientFromStoredTokens
};