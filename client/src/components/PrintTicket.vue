<template>
    <v-dialog
        v-model="dialog"
        width="1200"
        @keydown.esc="dialog = false"
    >
        <v-card :style="{ 'padding-top': topPadding, 'padding-right': rightPadding, height: '100%' }" class="over-flow-hidden">
            <v-card-title class="text-h4 padding-title text-center">
                כרטיס תיקון - {{ticket.ticketId}}
            </v-card-title>
            <v-container>
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

                <!-- ------------------- Item Area  ------------------- -->
                <div class="col mb--20 right-align" cols="12">
                    <div class="v-areaMiddle v-area1">
                        <div class="row mr-200 mb--30">
                            <div class="col" >
                                <p class="field-text"><b>תאור התקלה ע"פ הלקוח : </b>{{ticket.defectDescription && ticket.defectDescription.join('')}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text" style="direction: rtl;"><b>סוג המכשיר : </b>{{ticket.item}}</p>
                            </div>
                        </div>
                        <div class="row mr-200">
                            <div class="col" >
                                <p class="field-text"><b>נכנס לתיקון : </b>{{ticket.entryDate}}</p>
                            </div>
                            <div class="col" v-if="ticket.entryCondition != ''">
                                <p class="field-text"><b>מצב המכשיר : </b>{{ticket.entryCondition && ticket.entryCondition.join('')}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text"><b>אביזר נוסף : </b>{{ticket.accessories && ticket.accessories.join('')}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <v-row style="justify-content: center;">

                    <!-- ------------------- Treatment Area  ------------------- -->
                    <v-col v-if="includeTreatment" class="mb--20" cols="12">
                        <!-- <div class="treatment-area v-areaMiddle" :class="{'no-print': includeTreatment}"> -->
                        <div class="treatment-area v-areaMiddle" >
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>תאור ביצוע העבודה</th>
                                            <th>תקלות שאובחונו</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="index in maxRows" :key="index">
                                            <td>{{ ticket.defectFixes[index-1] }}</td>
                                            <td>{{ ticket.defectFound[index-1] }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                        </div>
                    </v-col>

                    <!-- ------------------- Payment Area  ------------------- -->
                    <v-col class="mb--20" cols="12">
                        <div class=" v-area">
                            <table class="table-payment">
                                <tbody style="text-align-last: right;">
                                    <tr><td>{{ ticket.amount ? ticket.amount.toLocaleString() : '' }}</td><td>מחיר</td></tr>
                                    <tr><td>{{ ticket.vat }}</td><td>מע"מ</td></tr>
                                    <tr><td>{{ ticket.total ? ticket.total.toLocaleString() : '' }}</td><td>סה"כ לתשלום</td></tr>
                                    <tr><td>{{ ticket.prepaid }}</td><td>שולם ע"ח  ({{ ticket.prepaidInvoice }}) </td></tr>
                                    <tr><td>{{ (ticket.total - ticket.prepaid).toLocaleString()}}</td><td><b>סה"כ נותר לתשלום</b></td></tr>
                                    <!-- <tr><td>Exit Date</td><td>{{ ticket.exitDate }}</td></tr>
                                    <tr><td>Remarks</td><td>{{ ticket.remarks }}</td></tr> -->
                                </tbody>
                                {{ ticket.invoice }} -  חשבונית
                            </table>
                        </div>
                    </v-col>
                </v-row>
                <div class="footer-content right-align">
                    <p> כאן צריך לבוא הערות הדפסת מכשיר</p>
                    <p class="heading"><span class="underline">תנאי אחריות</span></p>
                    <p>מעבדת ישראל אחראית על התיקון שבוצע בלבד כמפורט בכרטיס תיקון</p>
                    <p style="direction: rtl;">למשך 3 חודשים החל מתאריך - {{ ticket.exitDate }} </p>
                    <p>האחריות לא תחול בשל אחד או יותר מהתנאים הבאים</p>
                    <div class="list">
                        <li>ליקוי אחר במכשיר אשר לא פורט בכרטיס השרות</li>
                        <li>שבר או סדק כלשהו</li>
                        <li>הפעלה לא נכונה של המכשיר המנוגדת להוראות היצרון</li>
                        <li>המכשיר פורק ע"י אדם שאינו מורשה מטעם מעבדת ישראל</li>
                        <li>חדירת נוזלים לתוך המכשיר</li>
                    </div>
                    <p style="direction: rtl; text-align-last: center;">
                        <span>מאשר קבלת המכשיר בתאריך - {{ ticket.exitDate }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>חתימת הלקוח ______________</span></p>
                    <p class="bold-text">מעבדת ישראל - לשרותך תמיד !</p>
                </div>
            </v-container>
        </v-card>

    </v-dialog>
</template>

<script>
import { TICKET_MODEL, CUSTOMER_MODEL, VAT_PERCENTAGE, NEW_TICKET, printTicketTopPadding, printTicketRightPadding } from "../constants/constants";
import apiService from "../services/apiService";

export default {
    name: "ticket-form",
    data() {
        return {
            ticket: {customerName:''},
			dialog: false,
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
            includeTreatment: true,
        };
    },

    methods: {

        async open(ticket, newTicket) {
            this.newTicket = newTicket;
            this.ticket = newTicket ? NEW_TICKET : {...ticket};
            if(newTicket) {
                this.customerInfo = ''
                let lastTicket = await apiService.getMany({model: TICKET_MODEL , sort: {ticketId: -1 } , limit: 1});
                const { ticketId } = lastTicket.data[0];
                this.ticket.ticketId = ticketId+1
            } else {
                this.customers.push(ticket.customerName);
                const response = await apiService.getOne({model: CUSTOMER_MODEL, fullName:ticket.customerName})
                this.customerInfo = response.data
                this.ticket.exitDate ? this.ticket.exitDate = new Date(this.ticket.exitDate).toISOString().substr(0, 10) : ''
                this.ticket.entryDate ? this.ticket.entryDate = new Date(this.ticket.entryDate).toISOString().substr(0, 10) : ''
                this.ticket.fixDate ? this.ticket.fixDate = new Date(this.ticket.fixDate).toISOString().substr(0, 10) : ''
            }
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },

        print(data) {
            this.ticket = data.ticket;
            this.customerInfo = data.customerInfo;
            this.includeTreatment = data.includeTreatment;
            this.dialog = true;
            setTimeout(() => {	
                window.print();
			}, 500);
        },

        onAmountChange() {
            let { amount } = this.ticket;
            if(amount && amount >= 0) {
                this.ticket.vat = ((parseFloat(amount) * VAT_PERCENTAGE)/100)
                this.ticket.total = (this.ticket.vat + parseFloat(amount)).toFixed(0);
            } else {
                this.ticket.amount = 0;
                this.ticket.vat = 0;
                this.ticket.total = 0;
            }
        },

        onTotalChange() {
            let { total } = this.ticket;
            if(total && total >= 0) {
                this.ticket.amount = (parseFloat(total)/(1+VAT_PERCENTAGE/100)).toFixed(0);
                this.ticket.vat = (parseFloat(total)- this.ticket.amount).toFixed(0);
            } else {
                this.ticket.amount = 0;
                this.ticket.vat = 0;
                this.ticket.total = 0;
            }
        },
    },
    watch: {
        // Whenever the customer is piked - fatch customerInfo
        async 'ticket.customerName' (newFullName) {
            if (newFullName) {
                const response = await apiService.getOne({model: CUSTOMER_MODEL, fullName:newFullName})
                this.customerInfo = response.data
                this.ticket.customerId = this.customerInfo.customerId
            }
        }
    },
    computed: {
        maxRows() {
            let length = Math.max(  this.ticket.defectFound && this.ticket.defectFound.length || 0, 
                                    this.ticket.defectFixes && this.ticket.defectFixes.length || 0) ;
            return  length >= 0 ? length : 0;
        },
    },
    mounted() {
	},
};
</script>

<style scoped>
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
    .v-areaMiddle{
        border-radius: 0px;
    }

    .area-header {
        color: blue;
        font-size: large;
        font-style:italic;
    }

    .container {
        padding-bottom: 0px !important;
        font-size: medium;
    }
    @media screen {
        div.divHeader, div.divFooter{
            display: none;
        }
    }
    @media print {
        .print-logo{
            width: 30%;
        }
        div.divHeader {
            position: fixed;
            top: 0;
        }
        div.divFooter {
            position: fixed;
            bottom: 0;
            font-size: larger ;
        }
        .v-area1{
            border-radius: 0px;
            padding: 0px;
            margin: 0px;
            /* width:470px; */
            /* height:560px; */
        }
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
        margin-top: 42px;
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
        font-size: xx-large;
    }

    ::v-deep .padding-title{
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
        margin-right: -15px;
        margin-left: -15px;
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
        margin-right: 30px;
        margin-bottom: 30px;
    }

</style>