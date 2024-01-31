export const CUSTOMER_MODEL = 'customers';
export const TICKET_MODEL = 'tickets';
export const TABLE_MODEL = 'tables';
export const PHONE_MODEL = 'phones';
export const SHORT_DATE = { day: 'numeric', month: 'numeric' };

export const printTicketTopPadding = '85px';
export const printTicketRightPadding = '100px';

export const VAT_PERCENTAGE = 17;

export const messageTemplate = `__name__ היקר, המכשיר __itemName__ תוקן הנך מתבקש לסור למעבדה לקחתו. תודה, מעבדת ישראל.`;

export const TICKET_WEB_HEADERS = [
    { text: 'מס כרטיס', value: 'ticketId', align:'end', class: 'primary white--text' },
    // { text: 'שנה', value: 'year', align:'end', class: 'primary white--text' },
    { text: 'תאריך כניסה', value: 'entryDate', align:'end', class: 'primary white--text' },
    { text: 'שם לקוח', value: 'customerName', align:'end', class: 'primary white--text' },
    { text: 'מכשיר', value: 'item', align:'end', class: 'primary white--text' },
    { text: 'תאור תקלה', value: 'defectDescription', align:'end', class: 'primary white--text' },
    // { text: 'סה-כ', value: 'total', align:'end', class: 'primary white--text' },
    // { text: 'חשבונית', value: 'invoice', align:'end', class: 'primary white--text' },
    // { text: 'הערה לכרטיס', value: 'ticketRemark', align:'right', class: 'primary white--text' },
    // { text: 'תאריך תיקון', value: 'fixDate', align:'end', class: 'primary white--text' },
    // { text: 'תאריך יציאה', value: 'exitDate', align:'end', class: 'primary white--text' },
    // { text: '', value: 'controls', class: 'primary white--text' },
]

export const TICKET_MOBILE_HEADERS = [
    { text: 'מס כרטיס', value: 'ticketId', align:'end', class: 'primary white--text' },
    { text: 'כניסה', value: 'entryDate', align:'end', class: 'primary white--text' },
    { text: 'שם לקוח', value: 'customerName', align:'end', class: 'primary white--text' },
    { text: 'מכשיר', value: 'item', align:'end', class: 'primary white--text' },
    { text: 'תאור תקלה', value: 'defectDescription', align:'end', class: 'primary white--text' },
]

export const TICKET_SHORT_HEADERS = [
    { text: 'מס כרטיס', value: 'ticketId', align:'end', class: 'primary white--text' },
    { text: 'כניסה', value: 'entryDate', align:'end', class: 'primary white--text' },
    { text: 'מכשיר', value: 'item', align:'end', class: 'primary white--text' },
    { text: 'תאור תקלה', value: 'defectDescription', align:'end', class: 'primary white--text' },
    { text: 'סטטוס', value: 'ticketStatus', align:'end', class: 'primary white--text' },
]

export const CUSTOMER_HEADERS_VD = [  // used for vue-virtual-table
    { name: 'מס לקוח', prop: 'customerId' ,searchable: true, class: 'primary white--text'},
    { name: 'שם לקוח', prop: 'fullName', actionName:'name' ,searchable: true, class: 'primary white--text'},
    // { name: 'כתובת', prop: 'address',searchable: true, class: 'primary white--text' },
    // { name: 'עיר', prop: 'city' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 1', prop: 'phone1' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 2', prop: 'phone2' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 3', prop: 'phone3' ,searchable: true, class: 'primary white--text'},
    { name: 'הערה לקוח', prop: 'remark' , class: 'primary white--text'},
    // { name: 'הגיע אלינו', prop: 'arrivedFrom' ,searchable: true, class: 'primary white--text'},
    // { name: 'תאריך פתיחה', prop: 'issueDate', actionName:'issueDate' ,searchable: true, class: 'primary white--text'},
    // { name: 'פעולות', prop: 'controls', actionName: 'actionCommon' ,searchable: true, class: 'primary white--text'},
]

export const CUSTOMER_HEADERS = [
    // { text: 'מס לקוח', value: 'customerId' , align:'end', class: 'primary white--text'},
    { text: 'שם לקוח', value: 'fullName', actionName:'name' , align:'end', class: 'primary white--text', width: '55%'},
    // { text: 'שם לקוח', value: 'fullName', filter: f => { return ( f + '' ).includes(this.fullName) }},
    // { text: 'כתובת', value: 'address', align:'end', class: 'primary white--text' },
    // { text: 'עיר', value: 'city' , align:'end', class: 'primary white--text'},
    { text: 'בית 1', value: 'phone1' , align:'end', class: 'primary white--text', width: '15%'},
    { text: 'נייד 3', value: 'phone3' , align:'end', class: 'primary white--text', width: '15%'},
    { text: 'נוסף 2', value: 'phone2' , align:'end', class: 'primary white--text', width: '15%'},
    // { text: 'הערה לקוח', value: 'remark' , align:'end', class: 'primary white--text', width: '50%'},
    // { text: 'Arrived from', value: 'arrivedFrom' , align:'end'},
    // { text: 'Issue Date', value: 'issueDate', align:'end'},
    // { text: 'Controls', value: 'controls', align:'end'},
]

export const TABLE_HEADERS = [
    { text: "מספר",     value: "table_id",      class: 'primary white--text'},
    { text: "קוד",      value: "table_code",    class: 'primary white--text'},
    { text: "תאור",     value: "description",   class: 'primary white--text'},
    { text: "פעולות",   value: "actions",       class: 'primary white--text'},
  ]

export const PHONE_HEADERS = [
    { text: "שם מלא",           value: "fullName", class: 'primary white--text'},
    { text: "כתובת",         value: "address", class: 'primary white--text'},
    { text: "טלפון 1",         value: "phone1", class: 'primary white--text'},
    { text: "טלפון 2",         value: "phone2", class: 'primary white--text'},
    { text: "טלפון 3",         value: "phone3", class: 'primary white--text'},
    { text: "טלפון 4",         value: "phone4", class: 'primary white--text'},
    { text: "קיבוץ",  value: "phoneType", align:'end', class: 'primary white--text'},
    { text: "הערה",     value: "remark", class: 'primary white--text'},
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
    ticketRemark: '',
    fixHour: '',
    fixMin: '',
    partsCost: '', 
}

export const isMobile = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}