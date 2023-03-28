export const CUSTOMER_MODEL = 'customers';
export const TICKET_MODEL = 'tickets';
export const TABLE_MODEL = 'tables';

export const TICKET_HEADERS = [
    { text: 'Ticket ID', value: 'ticketId', align:'end' },
    { text: 'Year', value: 'year', align:'end' },
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
