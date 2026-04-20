const db = require('../models');

const MODEL_MAP = {
  Ticket: db.tickets,
  Customer: db.customers,
  Invoice: db.invoices,
  Payment: db.payments,
  Table: db.tables,
  Phone: db.phones
};

function getModel(modelName) {
  const model = MODEL_MAP[modelName];
  if (!model) {
    throw new Error(`Unknown model: ${modelName}`);
  }
  return model;
}

module.exports = {
  getModel
};