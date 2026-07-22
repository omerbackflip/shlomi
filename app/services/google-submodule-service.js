const path = require('path');
const { ServerApp } = require('../config/constants');

const {
  createFileTokenStore,
  createGoogleService
} = require('../../google/backend');

const tokenStore = createFileTokenStore(
  path.join(__dirname, '../config/token.json')
);

const googleService = createGoogleService({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
  tokenStore
});

async function uploadBackupExcelToDrive(filename) {
  const filePath = path.join(ServerApp.uploadFolderPath, filename);
  const folderId = process.env.GOOGLE_BACKUP_FOLDER_ID;

  if (!folderId) {
    throw new Error('GOOGLE_BACKUP_FOLDER_ID is missing in .env');
  }

  return googleService.uploadFileToDrive(filePath, folderId);
}

module.exports = {
  googleService,
  tokenStore,
  uploadBackupExcelToDrive,
  uploadFileToDrive: googleService.uploadFileToDrive,
  getStoredTokens: googleService.getStoredTokens,
  hasStoredTokens: googleService.hasStoredTokens,
  getOAuthClientFromStoredTokens: googleService.getOAuthClientFromStoredTokens
};
