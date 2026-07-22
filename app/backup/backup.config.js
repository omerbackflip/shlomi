module.exports = {
  driveFolderId: process.env.GOOGLE_BACKUP_FOLDER_ID || process.env.BACKUP_DRIVE_FOLDER_ID,
  zipPrefix: 'shlomi-backup',

  models: [
    {
      key: 'tickets',
      modelName: 'Ticket',
      archiveName: 'tickets.csv',
      headers: [
        'ticketId', 'ticketStatus', 'customerId', 'customerName', 'item',
        'entryCondition', 'accessories', 'defectDescription', 'defectFound',
        'defectFixes', 'prepaid', 'prepaidInvoice', 'amount', 'vat', 'total',
        'invoice', 'year', 'entryDate', 'fixDate', 'exitDate', 'remarks',
        'ticketRemark', 'fixHour', 'fixMin', 'partsCost'
      ]
    },
    {
      key: 'customers',
      modelName: 'Customer',
      archiveName: 'customers.csv',
      headers: [
        'customerId', 'fullName', 'address', 'city', 'phone1', 'phone2',
        'phone3', 'arrivedFrom', 'issueDate', 'hasTicket', 'ticketExist', 'remark'
      ]
    },
    {
      key: 'invoices',
      modelName: 'Invoice',
      archiveName: 'invoices.csv',
      headers: [
        'invoiceId', 'customerId', 'ticketId', 'amount', 'vat', 'total', 'remark'
      ]
    },
    {
      key: 'payments',
      modelName: 'Payment',
      archiveName: 'payments.csv',
      headers: [
        'supplierId', 'paymentId', 'checkId', 'date', 'amount', 'remark'
      ]
    },
    {
      key: 'tables',
      modelName: 'Table',
      archiveName: 'tables.csv',
      headers: [
        'table_id', 'table_code', 'description', 'numeric'
      ]
    },
    {
      key: 'phones',
      modelName: 'Phone',
      archiveName: 'phones.csv',
      headers: [
        'fullName', 'address', 'phone1', 'phone2', 'phone3', 'phone4',
        'phoneType', 'remark'
      ]
    }
  ]
};
