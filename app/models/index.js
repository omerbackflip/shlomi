const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tables = require("./table.model.js")(mongoose);
db.tickets = require("./ticket.model.js")(mongoose);
db.customers = require("./customer.model.js")(mongoose);
db.phones = require("./phone.model.js")(mongoose);
db.invoices = require("./invoice.model.js")(mongoose);
db.payments = require("./payment.model.js")(mongoose);

module.exports = db; 