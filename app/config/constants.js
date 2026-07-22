const path = require('path');

module.exports = {
  ServerApp: {
    configFolderPath: path.join(__dirname) + '/',
    uploadFolderPath: path.join(__dirname + '/../../uploads/')
  }
};
