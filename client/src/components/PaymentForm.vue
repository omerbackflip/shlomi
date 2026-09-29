<template>
    <v-dialog
        v-model="dialog"
        width="700"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="dialog = false"
    >
        <v-card class="center mobile-form-card">
            <v-card-title class="text-h5 grey lighten-2 mobile-form-title">
                {{ payment._id ? 'עדכון' : 'הוספה' }} - {{ supplierName}}
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>
                <v-row class="overflow-hidden form-row">
                    <v-col v-if="payment._id" cols="12" md="2">
                        <v-btn @click="copyPayment" class="mobile-full-button">שכפל</v-btn>         
                    </v-col>
                    <v-col cols="6" md="2">
                        <v-text-field v-model="payment.paymentId" label="מס' תשלום" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="6" md="2">
                        <v-text-field v-model="payment.checkId" label="מס' שיק" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="6" md="2">
                        <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="payment.date" v-bind="attrs" v-on="on" label="תאריך" reverse readonly hide-details></v-text-field>
                            </template>
                            <v-date-picker v-model="payment.date" @input="dateMenu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6" md="2">
                        <v-text-field v-model="payment.amount" label="סכום" hide-details></v-text-field>
                    </v-col> 
                </v-row>
                <v-row class="overflow-hidden form-row">
                    <v-col cols="12" md="10">
                        <v-text-field v-model="payment.remark" label="הערה" hide-details></v-text-field>
                    </v-col>
                </v-row> 
                <v-col cols="12" md="8" class="invoice-picker">
                    <v-data-table 
                        :headers ="invoiceHeaders" 
                        :items = "avilableInvoices"
                        disable-pagination
                        hide-default-footer
                        fixed-header
                        dense
                        class="elevation-3"
                        show-select
                        v-model="pickedInvoices"
                        item-key="invoiceId"
                        mobile-breakpoint="0"
                        no-data-text="אין חשבוניות זמינות"
                    >
                    <template v-slot:[`item.date`]="{ item }">
                        <span>{{ item.date ? new Date(item.date).toLocaleDateString('en-GB') : ''}}</span>
                    </template>
                    </v-data-table>
                </v-col>
            <v-divider></v-divider>

            <v-card-actions class="form-actions">
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> בטל </v-btn>
                <v-btn :disabled = "!payment" color="primary" text @click="submitTable()"> שמור </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { INVOICE_SHORT_HEADERS, INVOICE_MODEL, PAYMENT_MODEL } from "../constants/constants";
import apiService from "../services/apiService";

export default {
    name: "payment-form",
    data() {
        return {
            payment: {},
			dialog: false,
            resolve: null,  
			showMessage: false,
			message: '',
            options: {
                color: "grey lighten-3",
                width: 500,
                zIndex: 200,
            },
            supplierName:'',
            avilableInvoices:[],
            pickedInvoices:[],
            invoiceHeaders: INVOICE_SHORT_HEADERS,
            dateMenu: false,
        };
    },
    methods: {
        async submitTable() {
			try {
				let response;
                if (this.payment._id) { // if payment_id does NOT exsit - this is a new Payment
                    response = await apiService.updateEntity({_id: this.payment._id} , {...this.payment} , {model:PAYMENT_MODEL});
                } else {
                    response = await apiService.create({...this.payment} , {model:PAYMENT_MODEL});
                }
                // update avilable list to final before save to db.
                let piked_id = this.pickedInvoices.map((item) => {
                    return (item._id)
                })
                this.avilableInvoices.map(async (item) => {
                        item.paymentId = piked_id.includes(item._id) ? this.payment.paymentId : ''
                    return (item) 
                })

                this.avilableInvoices.map(async (item) => {
                        await apiService.updateEntity({_id: item._id} , {...item} , {model:INVOICE_MODEL});
                    return (item) 
                })

                if(response.data && response.data.data) {
					this.message = 'תשלום עודכן בהצלחה !!';
				}

                this.showMessage = true;
                setTimeout(() => {
                    this.dialog = false;
                    this.showMessage = false;
                    this.resolve(true);
                }, 2000);
			} catch (error) {
				console.log(error);
			}
		},

        async open(payment, supplierName) {
            this.payment = payment;
            this.payment.date ? this.payment.date = new Date(this.payment.date).toISOString().substr(0, 10) : ''
            this.supplierName = supplierName
            let response = await apiService.clientGetEntities(INVOICE_MODEL, {filter:{supplierId:this.payment.supplierId, paymentId:this.payment.paymentId}}) 
            let response1 = await apiService.clientGetEntities(INVOICE_MODEL, {filter:{supplierId:this.payment.supplierId, paymentId:""}})
            this.avilableInvoices = (response.data);
            for (let i=0 ; i < response1.data.length ; i++) {  
                this.avilableInvoices.push(response1.data[i]);
            }
            this.pickedInvoices = this.avilableInvoices.filter((item) => {
                    this.payment.amount += item.amount;
                return (item.paymentId)
            })
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },

        async copyPayment() {
            this.payment._id = null
            this.payment.checkId = null
            this.payment.date = null
            let response = await apiService.clientGetEntities(PAYMENT_MODEL, {filter:{supplierId: this.payment.supplierId}})
            if (response.data.length > 0) {
                let payments = response.data.sort((b, a) => a.paymentId - b.paymentId);
                this.payment.paymentId = payments[0].paymentId+1;
            } 
        }
    },

    watch: {
        pickedInvoices() {
            this.payment.amount = this.pickedInvoices.reduce((total, item) => {
                return item.amount + total
            },0)
        },
    }
};
</script>

<style scoped>
.overflow-hidden{
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    place-content: center;
}
.center {
    direction: rtl; 
    text-align: -webkit-center;
}

@media (max-width: 959px) {
    .mobile-form-card {
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        overflow-y: auto;
    }

    .mobile-form-title {
        flex: none;
        min-height: 58px;
        padding: 12px 16px;
        font-size: 1.25rem !important;
        line-height: 1.35;
        text-align: right;
        overflow-wrap: anywhere;
    }

    .form-row {
        width: 100%;
        padding: 4px 16px;
    }

    .form-row > .col {
        padding: 8px;
    }

    .mobile-full-button {
        width: 100%;
    }

    .invoice-picker {
        width: 100%;
        padding: 8px 16px 16px;
        overflow-x: auto;
    }

    .invoice-picker ::v-deep .v-data-table {
        min-width: 420px;
    }

    .form-actions {
        position: sticky;
        bottom: 0;
        z-index: 1;
        margin-top: auto;
        padding: 10px 16px;
        background-color: #ffffff;
        box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.12);
    }
}
</style>
