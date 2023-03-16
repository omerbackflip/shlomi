export const CUSTOMER_MODEL = 'customers';
export const TICKET_MODEL = 'tickets';
export const TABLE_MODEL = 'tables';

export const TICKET_HEADERS = [
    { text: 'Ticket ID', value: 'ticketId', align:'end' },
    { text: 'Entry date', value: 'entryDate', align:'end' },
    { text: 'Customer Name', value: 'customerName', align:'end' },
    { text: 'Item', value: 'item', align:'end' },
    { text: 'Defect description', value: 'defectDescription', align:'end' },
    { text: 'Total', value: 'total', align:'end' },
    { text: 'Invoice', value: 'invoice', align:'end' },
    { text: 'Remarks', value: 'remarks', align:'end' },
    { text: 'Fix Date', value: 'fixDate', align:'end' },
    { text: 'Exit Date', value: 'exitDate', align:'end' },
    { text: '', value: 'controls' },
]

export const ALL_TICKET_HEADERS = [
    { text: 'Customer ID', value: 'customerId', align:'end' },
    { text: 'Item code', value: 'itemCode', align:'end' },
    { text: 'Entry Contition', value: 'entryContition', align:'end' },
    { text: 'Check price', value: 'checkPrice', align:'end' },
    { text: 'Pre-paid', value: 'prepaid', align:'end' },
    { text: 'Discount price', value: 'discountPrice', align:'end' },
    { text: 'Repair price', value: 'repairPrice', align:'end' },
    { text: 'Accessories', value: 'accessories', align:'end' },
    { text: 'Default Fix Price', value: 'defaultFixPrice', align:'end' },
    { text: 'Prepaid invoice', value: 'prepaidInvoice', align:'end' },
    { text: 'Discount %', value: 'discount', align:'end' },
    { text: 'Exit Date', value: 'exitDate', align:'end' },
    { text: 'Paid', value: 'paid', align:'end' },
    { text: 'r Final', value: 'rFinal', align:'end' },
    { text: 'Receipt', value: 'receipt', align:'end' },
    { text: 'Archive', value: 'archive', align:'end' },
    { text: 'PartsCost', value: 'partsCost', align:'end' },
    { text: 'Elapse Time', value: 'elapseTime', align:'end' },
    { text: 'Prepaid Invoice', value: 'prepaidInvoice', align:'end' },
    { text: 'Approved', value: 'approved', align:'end' },
]

export const CUSTOMER_HEADERS = [
    { text: 'Customer ID', value: 'customerId', align:'end' },
    { text: 'Full Name', value: 'fullName', align:'end' },
    // { text: 'Name', value: 'name', align:'end' },
    // { text: 'Family', value: 'family', align:'end' },
    { text: 'Address', value: 'address', align:'end' },
    { text: 'City', value: 'city', align:'end' },
    { text: 'Phone 1', value: 'phone1', align:'end' },
    { text: 'Phone 2', value: 'phone2', align:'end' },
    { text: 'Phone 3', value: 'phone3', align:'end' },
    { text: 'Arrived from', value: 'arrivedFrom', align:'end' },
    { text: 'Issue Date', value: 'issueDate', align:'end' },
    { text: '', value: 'controls' },
]
