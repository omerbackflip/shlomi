<template>
    <v-dialog
        v-model="dialog"
        width="1200"
        @keydown.esc="dialog = false"
    >
        <div class="divHeader">
            <img class="print-logo" src="../../public/logo.jpg" alt="" srcset="" >
        </div>
        <v-card :style="{ 'padding-top': topPadding, 'padding-right': rightPadding, height: '100%' }" class="over-flow-hidden">
            <v-card-title class="text-h6 padding-title text-center">
                כרטיס תיקון - {{ticket.ticketId}}
            </v-card-title>
            <v-container>
                    <!-- ------------------- Customer Area  ------------------- -->

                <div class="col mb--20 right-align" cols="12">
                    <div class="v-area">
                        <div class="row mr-200 mb--30">
                            <div class="col px-2" >
                                <p class="field-text">כתובת : {{customerInfo.address +' '+ customerInfo.city}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text">שם לקוח : {{ticket.customerName}}</p>
                            </div>
                        </div>
                        <div class="row mr-200">
                            <div class="col" >
                                <p class="field-text">טלפון 3 : {{customerInfo.phone3}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text">טלפון 2 : {{customerInfo.phone2}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text">טלפון 1 : {{customerInfo.phone1}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ------------------- Item Area  ------------------- -->
                <div class="col mb--20 right-align" cols="12">
                    <div class="v-areaMiddle v-area1">
                        <div class="row mr-200 mb--30">
                            <div class="col" >
                                <p class="field-text">תאור התקלה ע"פ הלקוח : {{ticket.defectDescription && ticket.defectDescription.join('')}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text">סוג המכשיר : {{ticket.item}}</p>
                            </div>
                        </div>
                        <div class="row mr-200">
                            <div class="col" >
                                <p class="field-text">נכנס לתיקון : {{ticket.entryDate}}</p>
                            </div>
                            <div class="col" v-if="ticket.entryCondition != ''">
                                <p class="field-text">מצב המכשיר : {{ticket.entryCondition && ticket.entryCondition.join('')}}</p>
                            </div>
                            <div class="col" >
                                <p class="field-text">אביזר נוסף : {{ticket.accessories && ticket.accessories.join('')}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <v-row style="justify-content: center;">

                    <!-- ------------------- Treatment Area  ------------------- -->
                    <v-col v-if="entryMode" class="mb--20" cols="12">
                        <div class="treatment-area v-areaMiddle" :class="{'no-print': disableTreatment}">
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
                                <tbody>
                                    <tr><td>{{ ticket.amount }}</td>    <td style="text-align-last: right;">סכום</td></tr>
                                    <tr><td>{{ ticket.vat }}</td>       <td style="text-align-last: right;">מע"מ</td></tr>
                                    <tr><td>{{ ticket.total }}</td>     <td style="text-align-last: right;">סה"כ לתשלום</td></tr>
                                    <tr><td>{{ ticket.prepaid }}</td>   <td style="text-align-last: right;">שולם ע"ח  ({{ ticket.prepaidInvoice }}) </td></tr>
                                    <tr><td>{{ ticket.invoice }}</td>   <td style="text-align-last: right;">חשבונית</td></tr>
                                    <!-- <tr><td>Exit Date</td><td>{{ ticket.exitDate }}</td></tr>
                                    <tr><td>Remarks</td><td>{{ ticket.remarks }}</td></tr> -->
                                </tbody>
                            </table>
                        </div>
                    </v-col>
                </v-row>
                <div class="footer-content right-align">
                    <p>לורם איפסום דולוראיפסום דולור  איפסום דולור סיט אמת.</p>
                    <p>לורם  איפסום דולור איפסום דולור איפסום דולור סיט אמת.</p>
                    <p class="heading"><span class="underline">לורם איפסום</span> - כותרת מודגשת</p>
                    <p>לורם איפסוםאיפסום דולור  דולור סיט אמת, סיט אדיפיסינג אלית.</p>
                    <p>סד דו איאמוד טמפור  איפסום דולוראינקידידונט אות לבורה ואלורה מגנה אליקוא.</p>
                    <p class="date">21 מאי, 2023</p>
                    <ol>
                        <li> איפסום דולורלורם איפסום דולור סיט אמת</li>
                        <li>קונסקטטור אדיפיסינג אליתאיפסום דולור</li>
                        <li>סד דו איאמוד איפסום דולור טמפוראיפסום דולור</li>
                        <li>אינקידידונט אות לבורה ואלורה מגנה איפסום דולוראליקוא</li>
                        <li>אות אנים אד מיניםאיפסום דולור  ויניאםאיפסום דולור</li>
                    </ol>
                    <div class="line"></div>
                    <div class="signature-line">
                        <span class="sign">חתימה</span>
                        <span class="signature-underline"></span>
                        <span class="signature-text">לורם  איפסום דולוראיפסום 21 מאי, 2023</span>
                    </div>
                    <div class="line"></div>
                    <p class="bold-text right-align">אינקידידונט אות לבורה -  איפסום דולוראדיפיסינג אלית</p>
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
            entryMode: false,
            menu1: false,
            topPadding: printTicketTopPadding,
            rightPadding: printTicketRightPadding,
            disableTreatment: false,
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
            this.entryMode = data.disableTreatment;
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
            debugger // eslint-disable-line
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
        border: 0px solid black;
        border-radius: 0px;
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
    }

    .mb--20{
        margin-bottom: -20px;
    }

    .mb--30{
        margin-bottom: -40px;
    }

    .footer-content {
        font-size: 12px;
        color: black;
        margin-top: 12px;
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
        padding-right: 15px;
        padding-left: 15px;
    }

    .mr-200{
        margin-right: 10px;
    }

</style>