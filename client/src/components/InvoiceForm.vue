<template>
    <v-dialog
        v-model="dialog"
        width="700"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="dialog = false"
    >
        <v-card class="center">
            <v-card-title class="text-h5 grey lighten-2">
                הוספה/עדכון חשבונית/ת.משלוח לספק
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>
                <v-row class="overflow-hidden">
                    <v-col cols="2">
                        <v-text-field v-model="invoice.invoiceId" label="חשבונית/ת.משלוח" hide-details></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-menu v-model="dateMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="invoice.date" v-bind="attrs" v-on="on" label="תאריך" reverse readonly hide-details></v-text-field>
                            </template>
                            <v-date-picker v-model="invoice.date" @input="dateMenu = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="2">
                        <v-text-field v-model="invoice.amount" label="סכום" hide-details></v-text-field>
                    </v-col>          
                </v-row>
                <v-row class="overflow-hidden">
                    <v-col cols="8">
                        <v-text-field v-model="invoice.remark" label="הערה" hide-details></v-text-field>
                    </v-col>
                </v-row> 
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> בטל </v-btn>
                <v-btn :disabled = "!invoice" color="primary" text @click="submitTable()"> שמור </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { INVOICE_MODEL } from "../constants/constants";
import apiService from "../services/apiService";

export default {
    name: "invoice-form",
    data() {
        return {
            invoice: {},
            // suppliers:[],
			dialog: false,
            resolve: null,  
			showMessage: false,
			message: '',
            options: {
                color: "grey lighten-3",
                width: 500,
                zIndex: 200,
            },
            dateMenu: false,
        };
    },
    methods: {
        async submitTable() {
			try {
				let response;
                if (this.invoice._id) {
                    response = await apiService.update(this.invoice._id , {...this.invoice} , {model:INVOICE_MODEL});
                } else {
                    response = await apiService.create({...this.invoice} , {model:INVOICE_MODEL});
                }
                if(response.data && response.data.data) {
					this.message = 'רשומה עודכנה בהצלחה !!';
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
        open(invoice) {
            this.invoice = invoice;
            // this.invoice = invoice ? invoice : {}
            this.invoice.date ? this.invoice.date = new Date(this.invoice.date).toISOString().substr(0, 10) : ''
            // this.retrieveSuppliers();
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },
    },
};
</script>

<style scoped>
.overflow-hidden{
    overflow: hidden;
    margin: 0px;
    place-content: center;
}
.center {
    direction: rtl; 
    text-align: -webkit-center;
}
</style>