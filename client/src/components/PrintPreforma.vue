<template>
    <v-dialog v-model="preformaDialog" width="1200" @keydown.esc="preformaDialog = false">
        <v-card :style="{ 'padding-top': topPadding, 'padding-right': rightPadding }" class="elevation-0 preforma">
            <v-card-title class="text-h4 document-title">חשבון עסקה</v-card-title>
            <p class="document-title">כרטיס תיקון מס׳ {{ ticket.ticketId }}</p>
            <v-container>
                <div class="details">
                    <p><b>שם לקוח: </b>{{ ticket.customerName }}</p>
                    <p><b>כתובת: </b>{{ customerAddress }}</p>
                    <p v-for="(phone, index) in customerPhones" :key="index"><b>טלפון: </b>{{ phone }}</p>
                    <p><b>סוג המכשיר: </b>{{ ticket.item }}</p>
                    <p><b>תאריך חשבון עסקה: </b>{{ documentDate }}</p>
                </div>

                <table class="work-table">
                    <thead><tr><th>תיאור החלפים והעבודה שבוצעה</th></tr></thead>
                    <tbody>
                        <tr v-for="(description, index) in workDescriptions" :key="index">
                            <td>{{ description }}</td>
                        </tr>
                    </tbody>
                </table>

                <table class="payment-table">
                    <tbody>
                        <tr><td>מחיר לפני מע״מ</td><td>{{ money(hasDiscount ? ticket.discountBefore : ticket.amount) }} ש״ח</td></tr>
                        <tr v-if="hasDiscount"><td>הנחה — {{ ticket.discountPrecent }}%</td><td>{{ money(ticket.discountAmount) }} ש״ח</td></tr>
                        <tr v-if="hasDiscount"><td>סכום לאחר הנחה לפני מע״מ</td><td>{{ money(ticket.amount) }} ש״ח</td></tr>
                        <tr><td>מע״מ — {{ ticket.vat }}%</td><td>{{ money(vatAmount) }} ש״ח</td></tr>
                        <tr><td>סה״כ כולל מע״מ</td><td>{{ money(ticket.total) }} ש״ח</td></tr>
                        <tr><td>שולם מראש<span v-if="ticket.prepaidInvoice"> ({{ ticket.prepaidInvoice }})</span></td><td>{{ money(ticket.prepaid) }} ש״ח</td></tr>
                        <tr class="balance"><td>יתרה לתשלום</td><td>{{ money(balance) }} ש״ח</td></tr>
                    </tbody>
                </table>

                <div class="remarks">
                    <p v-for="(remark, index) in ticket.remarks || []" :key="index">{{ remark }}</p>
                </div>
                <p class="document-title footer">מעבדת ישראל — לשרותך תמיד!</p>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
import { printTicketTopPadding, printTicketRightPadding } from '../constants/constants';

export default {
    name: 'print-preforma',
    data() {
        return {
            ticket: {},
            customerInfo: {},
            preformaDialog: false,
            documentDate: '',
            topPadding: printTicketTopPadding,
            rightPadding: printTicketRightPadding,
            printTimer: null,
        };
    },
    computed: {
        customerAddress() {
            return [this.customerInfo.address, this.customerInfo.city].filter(Boolean).join(' ');
        },
        customerPhones() {
            return [this.customerInfo.phone1, this.customerInfo.phone2, this.customerInfo.phone3].filter(Boolean);
        },
        workDescriptions() {
            return this.ticket.defectFixes || [];
        },
        hasDiscount() {
            return Number(this.ticket.discountPrecent) > 0;
        },
        vatAmount() {
            return Number(this.ticket.amount || 0) * Number(this.ticket.vat || 0) / 100;
        },
        balance() {
            return Number(this.ticket.total || 0) - Number(this.ticket.prepaid || 0);
        },
    },
    methods: {
        money(value) {
            const amount = Number(value || 0);
            return Number.isFinite(amount) ? amount.toFixed(0) : '';
        },
        print(data) {
            this.ticket = data.ticket;
            this.customerInfo = data.customerInfo;
            this.documentDate = new Date().toLocaleDateString('en-GB');
            this.preformaDialog = true;
            clearTimeout(this.printTimer);
            this.printTimer = setTimeout(() => {
                if (this.preformaDialog) window.print();
            }, 1500);
        },
    },
    beforeDestroy() {
        clearTimeout(this.printTimer);
    },
};
</script>

<style scoped>
::v-deep .v-dialog {
    width: 850px !important;
    max-height: 100% !important;
    overflow: auto !important;
    box-shadow: none !important;
}
.preforma {
    direction: rtl;
    text-align: right;
    color: black;
    font-size: 15px;
}
.document-title {
    justify-content: center;
    text-align: center;
}
.details p { margin-bottom: 8px; }
table { border-collapse: collapse; }
th, td { border: 1px solid #c0bbbb; padding: 6px; }
.work-table { width: 100%; margin-top: 20px; }
.work-table td, .remarks p { white-space: pre-wrap; overflow-wrap: anywhere; }
.payment-table { width: 65%; margin: 24px 0 24px auto; }
.payment-table td:last-child { white-space: nowrap; }
.balance, .footer { font-weight: bold; }
.footer { margin-top: 30px; }
@media print {
    ::v-deep .v-dialog { overflow: visible !important; }
    tr { break-inside: avoid; }
    thead { display: table-header-group; }
    .payment-table { break-inside: avoid; }
}
</style>
