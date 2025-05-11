export const CUSTOMER_MODEL = 'customers';
export const TICKET_MODEL = 'tickets';
export const TABLE_MODEL = 'tables';
export const PHONE_MODEL = 'phones';
export const PAYMENT_MODEL = 'payments';
export const INVOICE_MODEL = 'invoices';
import apiService from "../services/apiService";

export const printTicketTopPadding = '115px';
export const printTicketRightPadding = '125px';

export const VAT_PERCENTAGE = 17;

export const messageTemplate = `__name__ היקר, המכשיר __itemName__ תוקן הנך מתבקש לסור למעבדה לקחתו. תודה, מעבדת ישראל.`;

export const ROUTE_LIST = [
    {icon: 'mdi-briefcase-check', text: 'כרטיסי תיקון', route: '/'},
    {icon: 'mdi-account-multiple-check', text: 'לקוחות', route: '/customers'},
    {icon: 'mdi-file-table-box-multiple', text: 'טבלאות', route: '/tables'},
    {icon: 'mdi-cash-multiple', text: 'יבוא נתונים', route: '/import'},
    {icon: 'mdi-cash-multiple', text: 'ספר טלפונים', route: '/phones'},
    {icon: 'mdi-cash-multiple', text: 'תשלומים לספקים', route: '/payments'},
]

export const TICKET_HEADERS = [
    { text: 'כרטיס', value: 'ticketId', align:'end', class: 'primary white--text', width: '5%' },
    { text: 'כניסה', value: 'entryDate', align:'end', class: 'primary white--text', width: '10%' },
    { text: 'שם לקוח', value: 'customerName', align:'start', class: 'primary white--text', width: '20%' },
    { text: 'מכשיר', value: 'item', align:'end', class: 'primary white--text', width: '20%' },
    { text: 'הערה לכרטיס', value: 'ticketRemark', align:'start', class: 'primary white--text', width: '20%' },
    { text: 'תאור תקלה', value: 'defectDescription', align:'end', class: 'primary white--text', width: '25%' },
]

export const TICKET_SHORT_HEADERS = [
    { text: 'מס כרטיס', value: 'ticketId', align:'end', class: 'primary white--text' },
    { text: 'כניסה', value: 'entryDate', align:'end', class: 'primary white--text' },
    { text: 'מכשיר', value: 'item', align:'end', class: 'primary white--text' },
    { text: 'תאור תקלה', value: 'defectDescription', align:'end', class: 'primary white--text' },
    { text: 'סטטוס', value: 'ticketStatus', align:'end', class: 'primary white--text' },
]

export const TICKET_MOBILE_HEADERS = [
    // { text: 'כניסה', value: 'entryDate', align:'end', class: 'primary white--text', width: '20%'  },
    { text: 'שם לקוח', value: 'customerName', align:'start', class: 'primary white--text', width: '50%' },
    { text: 'מכשיר', value: 'item', align:'start', class: 'primary white--text', width: '50%'  },
    // { text: 'תקלה', value: 'defectDescription', align:'end', class: 'primary white--text', width: '20%'  },
]
export const CUSTOMER_HEADERS_VD = [  // used for vue-virtual-table
    // { name: 'מס לקוח', prop: 'customerId' ,searchable: true, class: 'primary white--text'},
    { name: 'שם לקוח', prop: 'fullName', actionName:'name' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 1', prop: 'phone1' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 2', prop: 'phone2' ,searchable: true, class: 'primary white--text'},
    { name: 'טלפון 3', prop: 'phone3' ,searchable: true, class: 'primary white--text'},
    // { name: 'הערה לקוח', prop: 'remark' , class: 'primary white--text'},
]

// export const CUSTOMER_HEADERS = [
//     { text: 'שם לקוח', value: 'fullName', align:'end', class: 'primary white--text', width: '20%', filter: f => { return ( f + '' ).includes( this.fullName ) }},
//     { text: 'כתובת', value: 'address' ,align:'end', class: 'primary white--text', width: '20%'},
//     { text: 'בית 1', value: 'phone1' , align:'end', class: 'primary white--text', width: '20%'},
//     { text: 'נייד 3', value: 'phone3' , align:'end', class: 'primary white--text', width: '20%'},
//     { text: 'נוסף 2', value: 'phone2' , align:'end', class: 'primary white--text', width: '20%'},
// ]

export const TABLE_HEADERS = [
    { text: "מספר",     value: "table_id",      class: 'primary white--text'},
    { text: "קוד",      value: "table_code",    class: 'primary white--text'},
    { text: "תאור",     value: "description",   class: 'primary white--text'},
    { text: "פעולות",   value: "actions",       class: 'primary white--text'},
  ]

export const PAYMENT_HEADERS = [    
    { text: "ID",     value: "paymentId",      class: 'primary white--text', width: '8%'},
    { text: "שיק",     value: "checkId",      class: 'primary white--text', width: '12%'},
    { text: "תאריך",      value: "date",    class: 'primary white--text', width: '20%'},
    { text: "סכום",     value: "amount",   class: 'primary white--text', width: '11%'},
    { text: "הערה",     value: "remark",      class: 'primary white--text', width: '40%'},
    { text: "",   value: "actions",       class: 'primary white--text', width: '9%'},
  ]

export const INVOICE_HEADERS = [
    { text: "ID",     value: "paymentId",      class: 'primary white--text', width: '8%'},
    { text: "חשבונית",     value: "invoiceId",   class: 'primary white--text', width: '12%'},
    { text: "תאריך",      value: "date",    class: 'primary white--text', width: '20%'},
    { text: "סכום",     value: "amount",   class: 'primary white--text', width: '11%'},
    { text: "הערה",     value: "remark",      class: 'primary white--text', width: '40%'},
    { text: "",   value: "actions",       class: 'primary white--text', width: '9%'},
  ]

  export const INVOICE_SHORT_HEADERS = [
    { text: "חשבונית",     value: "invoiceId",   class: 'primary white--text'},
    { text: "תאריך",      value: "date",    class: 'primary white--text'},
    { text: "סכום",     value: "amount",   class: 'primary white--text'},
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
    discountBefore: '',
    discountPrecent: '',
    discountAmount: '',
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
export const loadTable = async (table_id) => {
    try {
        const response = await apiService.getMany({ table_id, model: TABLE_MODEL });
        if (response.data.length > 0) {
            return (response.data)
            // return (response.data.map((code) => code.description))
        } else return (window.alert("Read Table no - " + table_id + " faild"))
    } catch (error) {
        console.log(error);
    }
};