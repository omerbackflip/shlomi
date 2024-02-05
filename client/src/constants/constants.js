export const CUSTOMER_MODEL = 'customers';
export const TICKET_MODEL = 'tickets';
export const TABLE_MODEL = 'tables';
export const PHONE_MODEL = 'phones';

export const printTicketTopPadding = '85px';
export const printTicketRightPadding = '100px';

export const VAT_PERCENTAGE = 17;

export const messageTemplate = `__name__ היקר, המכשיר __itemName__ תוקן הנך מתבקש לסור למעבדה לקחתו. תודה, מעבדת ישראל.`;

export const ROUTE_LIST = [
    {icon: 'mdi-briefcase-check', text: 'כרטיסי תיקון', route: '/'},
    {icon: 'mdi-account-multiple-check', text: 'לקוחות', route: '/customers'},
    {icon: 'mdi-file-table-box-multiple', text: 'טבלאות', route: '/tables'},
    {icon: 'mdi-cash-multiple', text: 'יבוא נתונים', route: '/import'},
    {icon: 'mdi-cash-multiple', text: 'ספר טלפונים', route: '/phones'},
]

export const TICKET_HEADERS = [
    { text: 'מס כרטיס', value: 'ticketId', align:'end', class: 'primary white--text', width: '10%' },
    { text: 'כניסה', value: 'entryDate', align:'end', class: 'primary white--text', width: '10%' },
    { text: 'שם לקוח', value: 'customerName', align:'end', class: 'primary white--text', width: '15%' },
    { text: 'מכשיר', value: 'item', align:'end', class: 'primary white--text', width: '20%' },
    { text: 'תאור תקלה', value: 'defectDescription', align:'end', class: 'primary white--text', width: '45%' },
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
    { name: 'טלפון 1', prop: 'phone1' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 2', prop: 'phone2' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 3', prop: 'phone3' ,searchable: true, class: 'primary white--text'},
    { name: 'הערה לקוח', prop: 'remark' , class: 'primary white--text'},
]

export const CUSTOMER_HEADERS = [
    { text: 'שם לקוח', value: 'fullName', actionName:'name' , align:'end', class: 'primary white--text', width: '46%'},
    { text: 'בית 1', value: 'phone1' , align:'end', class: 'primary white--text', width: '18%'},
    { text: 'נייד 3', value: 'phone3' , align:'end', class: 'primary white--text', width: '18%'},
    { text: 'נוסף 2', value: 'phone2' , align:'end', class: 'primary white--text', width: '18%'},
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
    fixPrice: '',
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