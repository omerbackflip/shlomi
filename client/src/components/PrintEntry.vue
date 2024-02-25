<template>
    <v-dialog v-model="entryDialog" width="1200" @keydown.esc="entryDialog = false">
        <v-card :style="{ 'padding-top': topPadding, 'padding-right': rightPadding, height: '100%' }" class="elevation-0">
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
                        <span><b>נכנס לתיקון : </b>{{new Date(ticket.entryDate).toLocaleDateString('en-GB')}}</span>
                    </p>    
                    <br>
                    <p class="field-text"><b>אביזר נוסף : </b>{{ticket.accessories && ticket.accessories.join('')}}</p>
                    <br>
                    <p class="field-text"><b>תאור התקלה ע"פ הלקוח : </b>{{ticket.defectDescription && ticket.defectDescription.join('')}}</p>
                    <br>
                    <p class="field-text" v-if="ticket.entryCondition != ''"><b>מצב המכשיר : </b>{{ticket.entryCondition && ticket.entryCondition.join('')}}</p>
                    <br>
                    <p class="field-text">
                        <span><b>מחיר בדיקה (במידה ולא יתוקן) : </b> {{ticket.fixPrice}}  ש"ח</span>
                    </p>
                    <p class="field-text">
                        <span><b>שולם ע"ח : </b>{{ ticket.prepaid }} ש"ח</span>
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
            <br>
            <br>
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
                        <span><b>נכנס לתיקון : </b>{{new Date(ticket.entryDate).toLocaleDateString('en-GB')}}</span>
                    </p>    
                    <br>
                    <p class="field-text"><b>אביזר נוסף : </b>{{ticket.accessories && ticket.accessories.join('')}}</p>
                    <br>
                    <p class="field-text"><b>תאור התקלה ע"פ הלקוח : </b>{{ticket.defectDescription && ticket.defectDescription.join('')}}</p>
                    <br>
                    <p class="field-text" v-if="ticket.entryCondition != ''"><b>מצב המכשיר : </b>{{ticket.entryCondition && ticket.entryCondition.join('')}}</p>
                    <br>
                    <p class="field-text">
                        <span><b>מחיר בדיקה (במידה ולא יתוקן) : </b> {{ticket.fixPrice}}  ש"ח</span>
                    </p>
                    <p class="field-text">
                        <span><b>שולם ע"ח : </b>{{ ticket.prepaid }} ש"ח</span>
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
import { printTicketTopPadding, printTicketRightPadding } from "../constants/constants";

export default {
    name: "print-entry",
    data() {
        return {
            ticket: {customerName:''},
			entryDialog: false,
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
            this.entryDialog = true;
            setTimeout(() => {	
                window.print();
			}, 500);
        },
    },
    watch: {
    },
    computed: {
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

</style>