export const CUSTOMER_MODEL = 'customers';
export const TICKET_MODEL = 'tickets';
export const TABLE_MODEL = 'tables';

export const printTicketTopPadding = '100px';
export const printTicketRightPadding = '150px';

export const VAT_PERCENTAGE = 17;

export const messageTemplate = `__name__ היקר, המכשיר __itemName__ תוקן הנך מתבקש לסור למעבדה לקחתו. תודה, מעבדת ישראל.`;

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
    { name: 'Customer ID', prop: 'customerId' ,searchable: true},
    { name: 'Full Name', prop: '_action', actionName:'name' ,searchable: true},
    { name: 'Address', prop: 'address',searchable: true },
    { name: 'City', prop: 'city' ,searchable: true},
    { name: 'Phone 1', prop: 'phone1' ,searchable: true},
    { name: 'Phone 2', prop: 'phone2' ,searchable: true},
    { name: 'Phone 3', prop: 'phone3' ,searchable: true},
    { name: 'Arrived from', prop: 'arrivedFrom' ,searchable: true},
    { name: 'Issue Date', prop: '_action', actionName:'issueDate' ,searchable: true},
    { name: 'Controls', prop: '_action', actionName: 'actionCommon' ,searchable: true},
]

export const CUSTOMER_HEADERS_VD = [
    { text: 'Customer ID', value: 'customerId' , align:'end'},
    { text: 'Full Name', value: 'fullName', actionName:'name' , align:'end'},
    { text: 'Address', value: 'address', align:'end' },
    { text: 'City', value: 'city' , align:'end'},
    { text: 'Phone 1', value: 'phone1' , align:'end'},
    { text: 'Phone 2', value: 'phone2' , align:'end'},
    { text: 'Phone 3', value: 'phone3' , align:'end'},
    // { text: 'Arrived from', value: 'arrivedFrom' , align:'end'},
    // { text: 'Issue Date', value: 'issueDate', align:'end'},
    // { text: 'Controls', value: 'controls', align:'end'},
]

export const NEW_TICKET = {
    ticketId: '',
    ticketStatus: 'Open',
    customerId: '',
    customerName: '',
    item: '',
    entryCondition: [],
    accessories: [],
    defectDescription: [],
    defectFound: [],
    defectFixes: [],
    prepaid: '',
    prepaidInvoice: '',
    amount: '',
    vat: '',
    total: '',
    invoice: '',
    year: '',
    entryDate: new Date().toISOString().substr(0, 10),
    fixDate: null,
    exitDate: null,
    remarks: '',
}