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
    { name: 'Customer ID', prop: 'customerId' },
    { name: 'Full Name', prop: '_action', actionName:'name' },
    // { name: 'Name', prop: 'name' },
    // { name: 'Family', prop: 'family' },
    { name: 'Address', prop: 'address' },
    { name: 'City', prop: 'city' },
    { name: 'Phone 1', prop: 'phone1' },
    { name: 'Phone 2', prop: 'phone2' },
    { name: 'Phone 3', prop: 'phone3' },
    { name: 'Arrived from', prop: 'arrivedFrom' },
    { name: 'Issue Date', prop: '_action', actionName:'issueDate' },
    { name: 'Controls', prop: '_action', actionName: 'actionCommon' },
]
