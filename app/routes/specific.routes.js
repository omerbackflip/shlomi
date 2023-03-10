const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

// Save Bulk of Specific
// **************** EXAMPLE FILE FOR SPECIFIC ROUTES ************* //

module.exports = app => {
  const specific = require("../controllers/specific.controller.js");

  var router = require("express").Router();

  router.post("/save-customers",upload.single('file'), specific.saveCustomersBulk);
  router.post("/save-tables",upload.single('file'), specific.saveTablesBulk);
  router.post("/save-tickets",upload.single('file'), specific.saveTicketsBulk);

  router.get("/search-customers", specific.searchCustomer);
  
  app.use('/api/specific', router);
};