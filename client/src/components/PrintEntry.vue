<template>
    <v-dialog
        v-model="entryDialog"
        width="1200"
        @keydown.esc="entryDialog = false"
    >
        <v-card :style="{ 'padding-top': topPadding, 'padding-right': rightPadding, height: '100%' }">
            <v-card-title class="text-h5 text-center">
               שובר הזמנת תיקון מס'  - {{ticket.ticketId}}
            </v-card-title>
            <v-container class="generic1">
                    <!-- ------------------- Customer Area  ------------------- -->
                <div class="col mb--20 right-align" cols="12">
                    <div class="v-area">
                        <div class="row mr-200 mb--30">
                            <div class="col" >
                                <p class="field-text"><b>כתובת : </b>{{customerInfo.address +' '+ customerInfo.city}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text"><b>שם לקוח :</b>{{ticket.customerName}}</p>
                            </div>
                        </div>
                        <div class="row mr-200">
                            <div v-if="customerInfo.phone3" class="col" >
                                <p class="field-text"><b>טלפון 3 : </b>{{customerInfo.phone3}}</p>
                            </div>
                            <div v-if="customerInfo.phone2" class="col" >
                                <p class="field-text"><b>טלפון 2 : </b>{{customerInfo.phone2}}</p>
                            </div>
                            <div v-if="customerInfo.phone1" class="col" >
                                <p class="field-text"><b>טלפון 1 : </b>{{customerInfo.phone1}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <!-- ------------------- Item Area  ------------------- -->
                <div class="row">
                    <p class="field-text">
                        <span><b>סוג המכשיר : </b>{{ticket.item}}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span><b>נכנס לתיקון : </b>{{ticket.entryDate}}</span>
                    </p>    
                    <br>
                    <p class="field-text"><b>אביזר נוסף : </b>{{ticket.accessories && ticket.accessories.join('')}}</p>
                    <br>
                    <p class="field-text"><b>תאור התקלה ע"פ הלקוח : </b>{{ticket.defectDescription && ticket.defectDescription.join('')}}</p>
                    <br>
                    <p class="field-text" v-if="ticket.entryCondition != ''"><b>מצב המכשיר : </b>{{ticket.entryCondition && ticket.entryCondition.join('')}}</p>
                    <br>
                    <p class="field-text">
                        <span><b>מחיר בדיקה (במידה ולא יתוקן) : </b> 190 </span>
                    </p>
                    <p class="field-text">
                        <span><b>שולם ע"ח : </b>{{ ticket.prepaid }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span><b> ח/ק :     </b>{{ ticket.prepaidInvoice }}</span> 
                    </p>
                </div>
                <div class="footer-content">
                    <p>נא להתקשר לפני שמגיעים לקחת את המכשיר</p>
                    <p>מכשיר אשר לא ילקח לאחר 45 יום יפורק או יזרק ויצא מאחריותנו !!!</p>
                    <br>
                    <p style="text-align-last: right;"><b>חתימת הלקוח __________________</b></p>
                </div>
            </v-container>

            <br>

            <v-card-title class="text-h5 text-center">
               שובר הזמנת תיקון מס'  - {{ticket.ticketId}}
            </v-card-title>
            <v-container class="generic1">
                    <!-- ------------------- Customer Area  ------------------- -->
                <div class="col mb--20 right-align" cols="12">
                    <div class="v-area">
                        <div class="row mr-200 mb--30">
                            <div class="col" >
                                <p class="field-text"><b>כתובת : </b>{{customerInfo.address +' '+ customerInfo.city}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text"><b>שם לקוח :</b>{{ticket.customerName}}</p>
                            </div>
                        </div>
                        <div class="row mr-200">
                            <div v-if="customerInfo.phone3" class="col" >
                                <p class="field-text"><b>טלפון 3 : </b>{{customerInfo.phone3}}</p>
                            </div>
                            <div v-if="customerInfo.phone2" class="col" >
                                <p class="field-text"><b>טלפון 2 : </b>{{customerInfo.phone2}}</p>
                            </div>
                            <div v-if="customerInfo.phone1" class="col" >
                                <p class="field-text"><b>טלפון 1 : </b>{{customerInfo.phone1}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <!-- ------------------- Item Area  ------------------- -->
                <div class="row">
                    <p class="field-text">
                        <span><b>סוג המכשיר : </b>{{ticket.item}}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span><b>נכנס לתיקון : </b>{{ticket.entryDate}}</span>
                    </p>    
                    <br>
                    <p class="field-text"><b>אביזר נוסף : </b>{{ticket.accessories && ticket.accessories.join('')}}</p>
                    <br>
                    <p class="field-text"><b>תאור התקלה ע"פ הלקוח : </b>{{ticket.defectDescription && ticket.defectDescription.join('')}}</p>
                    <br>
                    <p class="field-text" v-if="ticket.entryCondition != ''"><b>מצב המכשיר : </b>{{ticket.entryCondition && ticket.entryCondition.join('')}}</p>
                    <br>
                    <p class="field-text">
                        <span><b>מחיר בדיקה (במידה ולא יתוקן) : </b> 190 </span>
                    </p>
                    <p class="field-text">
                        <span><b>שולם ע"ח : </b>{{ ticket.prepaid }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span><b> ח/ק :     </b>{{ ticket.prepaidInvoice }}</span> 
                    </p>
                </div>
                <div class="footer-content">
                    <p>נא להתקשר לפני שמגיעים לקחת את המכשיר</p>
                    <p>מכשיר אשר לא ילקח לאחר 45 יום יפורק או יזרק ויצא מאחריותנו !!!</p>
                    <br>
                    <p style="text-align-last: right;"><b>חתימת הלקוח __________________</b></p>
                </div>
            </v-container>
        </v-card>

    </v-dialog>
</template>

<script>
// import { TICKET_MODEL, CUSTOMER_MODEL, VAT_PERCENTAGE, NEW_TICKET, printTicketTopPadding, printTicketRightPadding } from "../constants/constants";
import { printTicketTopPadding, printTicketRightPadding } from "../constants/constants";
// import apiService from "../services/apiService";

export default {
    name: "print-entry",
    data() {
        return {
            ticket: {customerName:''},
			entryDialog: false,
            dateModal : false,
            dateModal2 : false,
            resolve: null,
			showMessage: false,
            newTicket: false,
            customerInfo: {address: null},
            loading: false,
            customers: [],
            menu: false,
            menu1: false,
            topPadding: printTicketTopPadding,
            rightPadding: printTicketRightPadding,
            printExit: true,
        };
    },

    methods: {

        // async open(ticket, newTicket) {
        //     this.newTicket = newTicket;
        //     this.ticket = newTicket ? NEW_TICKET : {...ticket};
        //     if(newTicket) {
        //         this.customerInfo = ''
        //         let lastTicket = await apiService.getMany({model: TICKET_MODEL , sort: {ticketId: -1 } , limit: 1});
        //         const { ticketId } = lastTicket.data[0];
        //         this.ticket.ticketId = ticketId+1
        //     } else {
        //         this.customers.push(ticket.customerName);
        //         const response = await apiService.getOne({model: CUSTOMER_MODEL, fullName:ticket.customerName})
        //         this.customerInfo = response.data
        //         this.ticket.exitDate ? this.ticket.exitDate = new Date(this.ticket.exitDate).toISOString().substr(0, 10) : ''
        //         this.ticket.entryDate ? this.ticket.entryDate = new Date(this.ticket.entryDate).toISOString().substr(0, 10) : ''
        //         this.ticket.fixDate ? this.ticket.fixDate = new Date(this.ticket.fixDate).toISOString().substr(0, 10) : ''
        //     }
        //     this.entryDialog = true;
        //     return new Promise((resolve) => {
        //         this.resolve = resolve;
        //     });
        // },

        print(data) {
            this.ticket = data.ticket;
            this.customerInfo = data.customerInfo;
            this.printExit = data.printExit;
            this.entryDialog = true;
            setTimeout(() => {	
                window.print();
			}, 500);
        },

        // onAmountChange() {
        //     let { amount } = this.ticket;
        //     if(amount && amount >= 0) {
        //         this.ticket.vat = ((parseFloat(amount) * VAT_PERCENTAGE)/100)
        //         this.ticket.total = (this.ticket.vat + parseFloat(amount)).toFixed(0);
        //     } else {
        //         this.ticket.amount = 0;
        //         this.ticket.vat = 0;
        //         this.ticket.total = 0;
        //     }
        // },

        // onTotalChange() {
        //     let { total } = this.ticket;
        //     if(total && total >= 0) {
        //         this.ticket.amount = (parseFloat(total)/(1+VAT_PERCENTAGE/100)).toFixed(0);
        //         this.ticket.vat = (parseFloat(total)- this.ticket.amount).toFixed(0);
        //     } else {
        //         this.ticket.amount = 0;
        //         this.ticket.vat = 0;
        //         this.ticket.total = 0;
        //     }
        // },
    },
    watch: {
        // Whenever the customer is piked - fatch customerInfo
        // async 'ticket.customerName' (newFullName) {
        //     if (newFullName) {
        //         const response = await apiService.getOne({model: CUSTOMER_MODEL, fullName:newFullName})
        //         this.customerInfo = response.data
        //         this.ticket.customerId = this.customerInfo.customerId
        //     }
        // }
    },
    computed: {
        // maxRows() {
        //     let length = Math.max(  this.ticket.defectFound && this.ticket.defectFound.length || 0, 
        //                             this.ticket.defectFixes && this.ticket.defectFixes.length || 0) ;
        //     return  length >= 0 ? length : 0;
        // },
    },
    mounted() {
	},
};
</script>

<style scoped>

    .generic1{
        overflow: hidden !important;
        font-size: initial !important;
    }
    ::v-deep .v-dialog {
        width: 850px !important;
        max-height: 100% !important;
        height: 100% !important;
        font-size: 12px !important;
        overflow: hidden !important;
        box-shadow: none !important;
    }
    .overflow{
        overflow: auto;
    }
    .v-area{
        padding: 0px;
        margin: 0px;
        text-align: -webkit-center
    }
    .container {
        padding-bottom: 0px !important;
        font-size: small;
    }
    .text-center{
        place-content: center;
    }

    .table {
      border-collapse: collapse;
    }
    .table-payment {
      border-collapse: collapse;
      width:   50%;
    }
    .table th, .table td {
      padding: 2px;
      border: 1px solid #c0bbbb;
    }
    .table-payment th, .table-payment td {
      padding: 2px;
      border: 1px solid #c0bbbb;
    }
    .table td{
        padding: 0px !important;
        margin: 0 !important; 
        line-height: 1.5 !important;
    }

    .field-text{
        min-inline-size: max-content;
        direction: rtl;
        text-align: right;
        padding-right: 0px;
    }

    .mb--20{
        margin-bottom: -20px;
    }

    .mb--30{
        margin-bottom: -40px;
    }

    .footer-content {
        font-size: 15px;
        color: black;
        margin-top: 22px;
        direction: rtl;
        text-align-last: center;
    }

    .right-align {
        text-align: right;
    }

    .heading {
        font-weight: bold;
    }

    .underline {
        text-decoration: underline;
    }

    .date {
        margin-top: 10px;
    }

    .line {
        height: 1px;
        background-color: rgb(255, 255, 255);
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .signature-line {
        display: flex;
        align-items: center;
    }

    .sign {
        margin-right: 10px;
    }

    .signature-underline {
        border-bottom: 1px solid black;
        width: 50px;
        margin-right: 10px;
    }

    .signature-text {
        flex-grow: 1;
    }
    .bold-text {
        font-weight: bold;
        text-align-last: center;
        direction: rtl;
        font-size: large;
    }

    ::v-deep {
        padding: 0px 6px -4px !important;
    }

    ::v-deep .container{
        margin-top: -10px;
    }

    ::v-deep p {
        margin-bottom: 8px !important;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        margin-right: 0px;
    }

    .col {
        position: relative;
        width: 100%;
        padding-right: 0px;
        padding-left: 15px;
    }

    .mr-200{
        margin-right: 0px;
    }
    .list {
        direction: rtl;
        text-align: right;
        margin-right: 30px;
        margin-bottom: 30px;
    }

</style>