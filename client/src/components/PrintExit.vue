<template>
    <v-dialog v-model="exitDialog" width="1200" @keydown.esc="exitDialog = false">
        <v-card :style="{ 'padding-top': topPadding, 'padding-right': rightPadding, height: '100%' }" class="elevation-0">
            <v-card-title class="text-h4 padding-title text-center">
             כרטיס תיקון מס' - {{ticket.ticketId}}
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
                                <p class="field-text"><b>נכנס לתיקון : </b>{{new Date(ticket.entryDate).toLocaleDateString('en-GB')}}</p>
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

                <v-row style="justify-content: center; margin: auto;">

                    <!-- ------------------- Treatment Area  ------------------- -->
                    <v-col class="mb--20" cols="12">
                        <div class="v-areaMiddle" >
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>תאור ביצוע העבודה</th>
                                            <th>תקלות שאובחנו</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="index in maxRows" :key="index">
                                            <td style="direction: rtl;">{{ ticket.defectFixes[index-1] }}</td>
                                            <td style="direction: rtl;">{{ ticket.defectFound[index-1] }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                        </div>
                    </v-col>

                    <!-- ------------------- Payment Area  ------------------- -->
                    <v-col class="mb--20" cols="12">
                        <div class=" v-area">
                            <table class="table-payment">
                                <tbody style="text-align-last: right; direction: rtl;">
                                    <tr><td>{{ ticket.discountPrecent > 0  ? ticket.discountBefore : ticket.amount }} ש"ח</td><td>מחיר</td></tr>
                                    <tr v-if="ticket.discountPrecent > 0"> <td>{{ ticket.discountAmount }} ש"ח</td><td style="direction: ltr;"> {{ ticket.discountPrecent }}% - הנחה </td></tr>
                                    <tr><td>{{ (ticket.vat*ticket.amount/100).toFixed(0) }} ש"ח</td><td>מע"מ  -   % {{ ticket.vat }}</td></tr>
                                    <tr><td>{{ ticket.total ? ticket.total : '' }} ש"ח</td><td>סה"כ לתשלום</td></tr>
                                    <tr><td>{{ ticket.prepaid }} ש"ח</td><td>שולם ע"ח  ({{ ticket.prepaidInvoice }}) </td></tr>
                                    <tr style="font-size: large;">
                                        <td><b>{{ (ticket.total - ticket.prepaid)}} ש"ח</b></td>
                                        <td><b>סה"כ נותר לתשלום</b></td>
                                    </tr>
                                </tbody>
                                {{ ticket.invoice }} -  חשבונית
                            </table>
                        </div>
                    </v-col>
                </v-row>
                <div class="footer-content right-align">
                    <span v-for="index in maxRemarkRows" :key="index">
                        <p class="field-text">{{ticket.remarks[index-1]}}</p>
                    </span>
                    <div v-if="ticket.fixDate"> <!-- print this section only when fixDate is  not null -->
                        <p class="heading"><span class="underline">תנאי אחריות</span></p>
                        <p>מעבדת ישראל אחראית על התיקון שבוצע בלבד כמפורט בכרטיס תיקון</p>
                        <p style="direction: rtl;">למשך 3 חודשים החל מתאריך - {{ new Date(ticket.exitDate).toLocaleDateString('en-GB') }} </p>
                        <p>האחריות לא תחול בשל אחד או יותר מהתנאים הבאים</p>
                        <div class="list">
                            <li>ליקוי אחר במכשיר אשר לא פורט בכרטיס השרות</li>
                            <li>שבר או סדק כלשהו</li>
                            <li>הפעלה לא נכונה של המכשיר המנוגדת להוראות היצרן</li>
                            <li>המכשיר פורק ע"י אדם שאינו מורשה מטעם <b>"מעבדת ישראל"</b></li>
                            <li>חדירת נוזלים לתוך המכשיר</li>
                        </div>
                    </div>
                    <p style="direction: rtl; text-align-last: center;">
                        <span>מאשר קבלת המכשיר בתאריך {{ new Date(ticket.exitDate).toLocaleDateString('en-GB') }}</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>חתימת הלקוח ______________</span></p>
                    <p class="bold-text">מעבדת ישראל - לשרותך תמיד !</p>
                </div>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import { printTicketTopPadding, printTicketRightPadding } from "../constants/constants";

export default {
    name: "print-exit",
    data() {
        return {
            ticket: {customerName:''},
			exitDialog: false,
            customerInfo: {address: null},
            topPadding: printTicketTopPadding,
            rightPadding: printTicketRightPadding,
            // printExit: true,
        };
    },

    methods: {
        print(data) {
            this.ticket = data.ticket;
            this.customerInfo = data.customerInfo;
            // this.printExit = data.printExit;
            this.exitDialog = true;
            setTimeout(() => {	
                window.print();
			}, 1500); // this time is needed to let the screen to be full proccessed then call to print
        },
    },
    watch: {

    },
    computed: {
        maxRows() {
            let length = Math.max(  this.ticket.defectFound && this.ticket.defectFound.length || 0, 
                                    this.ticket.defectFixes && this.ticket.defectFixes.length || 0) ;
            return  length >= 0 ? length : 0;
        },
        maxRemarkRows() {
            let length = Math.max(  this.ticket.remarks && this.ticket.remarks.length || 0) ;
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
        font-size: 15px !important;
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

    /* .area-header {
        color: blue;
        font-size: large;
        font-style:italic;
    } */

    .container {
        padding-bottom: 0px !important;
        /* font-size: small; */
    }
    /* @media screen {
        div.divHeader, div.divFooter{
            display: none;
        }
    } */
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

    /* .table {
      border-collapse: collapse;
      padding: 2px;
    } */
    .table-payment {
      border-collapse: collapse;
      width:   50%;
    }
    .table th {
      padding: 2px;
      border: 1px solid #c0bbbb;
      font-size: larger !important;
    }
    .table-payment th, .table-payment td {
      padding: 2px;
      border: 1px solid #c0bbbb;
    }
    .table td{
        padding: 0px !important;
        margin: 0 !important; 
        line-height: 1.5 !important;
        text-align: right !important;
        border: 1px solid #c0bbbb;
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
        font-size: large;
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
        /* margin-right: -15px;
        margin-left: -15px; */
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
    .table td {
        padding-left: 3px;
    }
</style>