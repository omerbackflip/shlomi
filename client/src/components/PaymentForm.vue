<template>
    <v-dialog
        v-model="dialog"
        width="700"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="dialog = false"
    >
        <v-card class="center">
            <v-card-title class="text-h5 grey lighten-2">
                {{ payment._id ? 'עדכון' : 'הוספה' }} - {{ supplierName}}
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>
                <v-row class="overflow-hidden">
                    <v-col cols="2">
                        <v-btn v-if="payment._id" @click="copyPayment">שכפל</v-btn>         
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="payment.paymentId" label="מס' תשלום" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="payment.checkId" label="מס' שיק" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="payment.date" v-bind="attrs" v-on="on" label="תאריך" reverse readonly hide-details></v-text-field>
                            </template>
                            <v-date-picker v-model="payment.date" @input="dateMenu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="payment.amount" label="סכום" hide-details></v-text-field>
                    </v-col> 
                </v-row>
                <v-row class="overflow-hidden">
                    <v-col cols="10">
                        <v-text-field v-model="payment.remark" label="הערה" hide-details></v-text-field>
                    </v-col>
                </v-row> 
                <v-col cols="8" >
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
                        item-key="amount"
                    >
                    <template v-slot:[`item.date`]="{ item }">
                        <span>{{ item.date ? new Date(item.date).toLocaleDateString('en-GB') : ''}}</span>
                    </template>
                    </v-data-table>
                </v-col>
            <v-divider></v-divider>

            <v-card-actions>
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
                    response = await apiService.update(this.payment._id , {...this.payment} , {model:PAYMENT_MODEL});
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
                        await apiService.update(item._id , {...item} , {model:INVOICE_MODEL});
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
            let response = await apiService.getMany({model:INVOICE_MODEL, supplierId:this.payment.supplierId, paymentId:this.payment.paymentId}) 
            let response1 = await apiService.getMany({model:INVOICE_MODEL, supplierId:this.payment.supplierId, paymentId:""})
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
            let response = await apiService.getMany({ model: PAYMENT_MODEL, supplierId: this.payment.supplierId})
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
</style>