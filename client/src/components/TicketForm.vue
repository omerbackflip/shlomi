<template>
    <v-dialog
        v-model="dialog"
        width="1200"
        @keydown.esc="cancel"
    >
        <v-card class="overflow-hidden">
            <v-card-title class="text-h6 grey lighten-2">
                {{!(ticket.ticketId) ? 'New' : 'Update'}} Ticket - {{ticket.ticketId}}
            </v-card-title>
            <v-container>
                <v-row >
                    <!-- ------------------- Customer Area  ------------------- -->
                    <v-layout justify-center>
                        <div class="v-area">
                            <h6 class="area-header">Customer Area</h6>
                            <v-row no-gutters>
                                <v-col cols="3">
                                    <v-autocomplete
                                        v-model="ticket.customerName" 
                                        label="Customer Name"
                                        auto-select-first
                                        :search-input.sync="search"
                                        append-icon="mdi-account-plus"
                                        cache-items
                                        class="mx-3"
                                        flat
                                        hide-no-data
                                        hide-details
                                        @click:append="openNewCustomerForm"
                                        :items="customers"
                                    ></v-autocomplete>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field type="text" v-model="customerInfo.address" label="Address" readonly></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="2">
                                    <v-text-field type="text" v-model="customerInfo.phone1" label="Phone 1" readonly></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="2">
                                    <v-text-field type="text" v-model="customerInfo.phone2" label="Phone 2" readonly></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="2">
                                    <v-text-field type="text" v-model="customerInfo.phone3" label="Phone 3" readonly></v-text-field>
                                </v-col>                            </v-row>
                        </div>
                    </v-layout>
                    <!-- ------------------- Item Area  ------------------- -->
                    <v-col cols="6">
                        <div class="payment-area v-area">
                            <h6 class="area-header">Item Area</h6>
                            <v-row no-gutters>
                                <v-col class="pl-2 pr-2" cols="6">
                                    <v-combobox v-model="ticket.item" :items="itemList" label="Item"/>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="3">
                                    <v-menu v-model="menu2" :close-on-content-click="false" nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.entryDate" v-bind="attrs" v-on="on" label="Entry Date" readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.entryDate" @input="menu2 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="2">
                                    <v-text-field type="number" v-model="ticket.checkPrice" label="Check price"></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="12">
                                    <v-combobox v-model="ticket.accessories" :items="accessoriesList" label="Accessories" multiple chips/>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="12">
                                    <v-combobox v-model="ticket.entryCondition" :items="entryConditionList" label="Entry Condition" multiple chips/>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="12">
                                    <v-combobox v-model="ticket.defectDescription" :items="defectList" label="Defect description" multiple chips/>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Treatment Area  ------------------- -->
                    <v-col cols="6">
                        <div class="treatment-area v-area">
                            <h6 class="area-header">Treatment Area</h6>
                            <v-row no-gutters>
                                <v-col class="pl-2 pr-2" cols="12">
                                    <v-combobox chips v-model="ticket.defectFound" :items="defectFoundList" label="Defects Found" multiple></v-combobox>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="12">
                                    <v-combobox chips v-model="ticket.defectFixes" :items="defectFixesList" label="Defect Fixes" multiple></v-combobox>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="3">
                                    <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.fixDate" v-bind="attrs" v-on="on" label="Fix Date" readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.fixDate" @input="menu1 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Payment Area  ------------------- -->
                    <v-col cols="12" >
                        <div class="payment-area v-area">
                            <h6 class="area-header">Payment Area</h6>
                            <v-row no-gutters>
                                <v-col class="pl-2 pr-2" cols="1">
                                    <v-text-field type="number" v-model="ticket.prepaid" label="Pre-paid"></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="1">
                                    <v-text-field v-model="ticket.prepaidInvoice" label="PP-Invoice"></v-text-field>
                                </v-col>                                
                                <v-col class="pl-2 pr-2" cols="1">
                                    <v-text-field @input="onAmountChange" type="number" v-model="ticket.amount" label="Amount"></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="1">
                                    <v-text-field type="vat" v-model="ticket.vat" label="VAT"></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="1">
                                    <v-text-field @input="onTotalChange" type="total" v-model="ticket.total" label="Total"></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="1">
                                    <v-text-field v-model="ticket.invoice" label="Invoice ID"></v-text-field>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="2">
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.exitDate" v-bind="attrs" v-on="on" label="Exit Date" readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.exitDate" @input="menu = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="12">
                                    <v-text-field v-model="ticket.remarks" label="Remark"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
            </v-container>

            <v-card-actions>
                <v-btn-toggle v-model="ticket.ticketStatus" group mandatory color="error">
                    <v-btn text value="Open"     elevation='3' small> Open   </v-btn>
                    <v-btn text value="Checked"  elevation='3' small> Checked</v-btn>
                    <v-btn text value="Fixed"    elevation='3' small> Fixed  </v-btn>
                    <v-btn text value="Closed"   elevation='3' small> Closed </v-btn>
                </v-btn-toggle>                <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="dialog = false"> Cancel</v-btn>
                    <v-btn :disabled = "!ticket.customerName" color="primary" text @click="submitTicket()" :loading="loading"> Save </v-btn>
            </v-card-actions>
        </v-card>
        <customer-form ref="customerForm"/>
    </v-dialog>
</template>

<script>
import { TICKET_MODEL, TABLE_MODEL, CUSTOMER_MODEL, VAT_PERCENTAGE } from "../constants/constants";
import apiService from "../services/apiService";
import specificServiceEndPoints from '../services/specificServiceEndPoints';
import CustomerForm from './CustomerForm.vue';
import debounce from 'debounce';

export default {
    name: "ticket-form",
    components: { CustomerForm },
    data() {
        return {
            ticket: {customerName:'asd'},
			dialog: false,
            dateModal : false,
            dateModal2 : false,
            resolve: null,  
			showMessage: false,
            search: '',
            newTicket: false,
            options: {
                color: "grey lighten-3",
                width: 1500,
                zIndex: 1200,
            },
            defectList: [],
            itemList: [],
            accessoriesList: [],
            entryConditionList: [],
            defectFoundList: [],
            defectFixesList: [],
            customers: [],
            customerInfo: '',
            loading: false,
            menu: false,
            menu1: false,
            menu2: false,

        };
    },

    methods: {
        async submitTicket() {
            this.loading = true
			try {
				if(this.newTicket) {
                    this.ticket.year = new Date(this.ticket.entryDate).getFullYear() ;
                    let lastTicket = await apiService.getMany({model: TICKET_MODEL , sort: {ticketId: -1 } , limit: 1});
                    const { ticketId } = lastTicket.data[0];
                    await apiService.create({...this.ticket, ticketId: ticketId+1} , {model:TICKET_MODEL});
				} else {
					await apiService.update(this.ticket._id , { ...this.ticket } , {model:TICKET_MODEL});
				}
                this.dialog = false;
			} catch (error) {
				console.log(error);
			}
            this.loading = false
		},

        debounceInput: debounce(async function (value) {
            if(value) {
                let response = await specificServiceEndPoints.searchCustomers({customer: value});
                this.customers = response.data.customers.map(item => item.name);
            }
        }, 200),

        async open(ticket, newTicket) {
            this.newTicket = newTicket;
            this.ticket = newTicket ? {} : {...ticket};
            if(!newTicket) {
                this.customers.push(ticket.customerName);
                const response = await apiService.getOne({model: CUSTOMER_MODEL, fullName:ticket.customerName})
                this.customerInfo = response.data
                this.ticket.exitDate ? this.ticket.exitDate = new Date (this.ticket.exitDate).toISOString().substr(0, 10) : ''
                this.ticket.entryDate ? this.ticket.entryDate = new Date (this.ticket.entryDate).toISOString().substr(0, 10) : ''
                this.ticket.fixDate ? this.ticket.fixDate = new Date (this.ticket.fixDate).toISOString().substr(0, 10) : ''
            }
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },

        async openNewCustomerForm(){
			this.ticket.customerName = await this.$refs.customerForm.open(null, true);
            this.customers.push(this.ticket.customerName);
        },

        async getDefectList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 4} );
            this.defectList = response.data.map((item) => {
                return (item.description)
            });
        },

        async getItemsList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 1} );
            this.itemList = response.data.map((item) => {
                return (item.description)
            });
        },

        async getAccessoriesList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 11} );
            this.accessoriesList = response.data.map((item) => {
                return (item.description)
            });
        },

        async getEntryConditionList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 12} );
            this.entryConditionList = response.data.map((item) => {
                return (item.description)
            });
        },

        async getDefectFoundList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 5} );
            this.defectFoundList = response.data.map((item) => {
                return (item.description)
            });
        },

        async getDefectFixesList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 6} );
            this.defectFixesList = response.data.map((item) => {
                return (item.description)
            });
        },

        onAmountChange() {
            let { amount } = this.ticket;
            if(amount && amount >= 0) {
                this.ticket.vat = ((amount * VAT_PERCENTAGE)/100).toFixed(2);
                this.ticket.total = parseFloat(this.ticket.vat) + +amount;
            } else {
                this.ticket.amount = 0;
                this.ticket.vat = 0;
                this.ticket.total = 0;
            }
        },
        onTotalChange() {
            let { total } = this.ticket;
            if(total && total >= 0) {
                this.ticket.amount = (total/1.17).toFixed(2);
                this.ticket.vat = parseFloat(this.ticket.total)- +this.ticket.amount;
            } else {
                this.ticket.amount = 0;
                this.ticket.vat = 0;
                this.ticket.total = 0;
            }
        }
    },
    watch: {
        search (val) {
            if (!val) {
                return
            }
            this.debounceInput(val)
        }
    },
    mounted() {
		this.getDefectList();
		this.getItemsList();
		this.getAccessoriesList();
		this.getEntryConditionList();
		this.getDefectFoundList();
		this.getDefectFixesList();
	},
};
</script>

<style scoped>
    .p-4{
        padding: 15px
    }
    .overflow-hidden{
        overflow: hidden;
    }
    .v-area{
        border: 1px solid black;
        border-radius: 12px;
        padding: 5px;
        margin: 5px;
    }

    .v-chip{
        border-radius: 5px !important;
        font-size: 10px !important;
        height: 18px !important;
    }
</style>