const path = require('path');

module.exports = {
  ServerApp: {
    configFolderPath: path.join(__dirname) + '/',
    uploadFolderPath: path.join(__dirname + '/../../uploads/'),

    google: {
      pickerRootFolder: '1QWL3SLxwAXQGWPTYSEcq9OtWNUIQyGHO' // this is shlomi's backup folder in google drive
    }
  }
};