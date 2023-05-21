<template>
    <v-dialog
        v-model="dialog"
        width="1200"
        @keydown.esc="dialog = false"
    >
        <div class="divHeader">
            <img class="print-logo" src="../../public/logo.jpg" alt="" srcset="" >
        </div>
        <v-card >
            <v-card-title class="text-h6 grey lighten-2">
                {{(newTicket) ? '' : 'עדכון'}} כרטיס תיקון - {{ticket.ticketId}}
                <v-spacer></v-spacer>
                <v-btn @click="dialog = false" small><v-icon small> mdi-close </v-icon> </v-btn>
            </v-card-title>
            <v-container>
                <v-row style="justify-content: center;">
                    <!-- ------------------- Customer Area  ------------------- -->
                    <v-col cols="10">
                        <div class="v-area">
                            <h6 class="area-header">Customer Area</h6>
                            <v-row no-gutters>
                                <v-col cols="6" sm="3">
                                    <v-autocomplete
                                        v-model="ticket.customerName"
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
                                <v-col class="px-2" cols="6" sm="3">
                                    <!-- <v-text-field type="text" v-model="customerInfo.address" label="כתובת" readonly single-line reverse></v-text-field> -->
                                    <v-text-field type="text" :value="customerInfo.address +' '+ customerInfo.city" readonly reverse></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone1" readonly></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone2" readonly></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone3" readonly></v-text-field>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Treatment Area  ------------------- -->
                    <v-col sm="6">
                        <div class="treatment-area v-areaMiddle v-area1" :class="{'no-print': disableTreatment}">
                            <h6 class="area-header">Treatment Area</h6>
                            <v-row no-gutters>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectFound" :items="defectFoundList" label="רשימת ממצאים" multiple reverse></v-combobox>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectFixes" :items="defectFixesList" label="רשימת תיקונים" multiple reverse></v-combobox>
                                </v-col>
                                <v-col class="px-2" cols="4">
                                    <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.fixDate" v-bind="attrs" v-on="on" label="תאריך תיקון" readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.fixDate" @input="menu1 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Item Area  ------------------- -->
                    <v-col sm="6">
                        <div class=" v-areaMiddle v-area1">
                            <h6 class="area-header">Item Area</h6>
                            <v-row no-gutters>
                                <v-col class="px-2" cols="6">
                                    <v-combobox v-model="ticket.item" :items="itemList" label="שם המכשיר" reverse/>
                                </v-col>
                                <v-col class="px-2" cols="4">
                                    <v-menu v-model="menu2" :close-on-content-click="false" nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.entryDate" v-bind="attrs" v-on="on" label="תאריך כניסה" readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.entryDate" @input="menu2 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <!-- <v-col class="px-2" cols="2">
                                    <v-text-field v-model="ticket.checkPrice" label="מחיר בדיקה"></v-text-field>
                                </v-col> -->
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectDescription" :items="defectList" label="תאור התקלה" multiple reverse dense/>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.entryCondition" :items="entryConditionList" label="מצב המכשיר" multiple reverse dense/>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.accessories" :items="accessoriesList" label="אביזר נוסף" multiple reverse/>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Payment Area  ------------------- -->
                    <v-col cols="12">
                        <div class=" v-area">
                            <h6 class="area-header">Payment Area</h6>
                            <v-row no-gutters>
                                <v-col class="px-2" cols="6" sm="2">
                                    <v-text-field type="number" v-model="ticket.prepaid" label="שולם מראש" @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="6" sm="2">
                                    <v-text-field v-model="ticket.prepaidInvoice" label="חשבונית מראש" @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="2">
                                    <v-text-field @input="onAmountChange" type="number" v-model="ticket.amount" label="סכום" @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="2">
                                    <v-text-field type="vat" v-model="ticket.vat" label="מע'מ" @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="2">
                                    <v-text-field @input="onTotalChange" type="total" v-model="ticket.total" label="סה'ב" @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="2">
                                    <v-text-field v-model="ticket.invoice" label="חשבונית" @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4">
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.exitDate" v-bind="attrs" v-on="on" label="תאריך יציאה" readonly/>
                                        </template>
                                        <v-date-picker v-model="ticket.exitDate" @input="menu = false"/>
                                    </v-menu>
                                </v-col>
                                <v-col class="px-2" cols="8">
                                    <v-combobox v-model="ticket.remarks" :items="remarkList" label="הערות" reverse/>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
                <div class="no-print">
                    <v-card-actions>
                        <v-col>
                            <v-layout wrap justify-center>
                                <v-btn-toggle v-model="ticket.ticketStatus" group mandatory color="error">
                                    <v-btn text value="Open"     elevation='3' small>פתוח</v-btn>
                                    <v-btn text value="Checked"  elevation='3' small>נבדק</v-btn>
                                    <v-btn text value="Fixed"    elevation='3' small>תוקן</v-btn>
                                    <v-btn text value="Closed"   elevation='3' small>סגור</v-btn>
                                </v-btn-toggle>
                                <v-spacer></v-spacer>
                                <v-btn @click="printTicket(disableTreatment = true)" small>קליטה</v-btn>
                                <v-btn @click="printTicket(disableTreatment = false)" small>יציאה</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn @click="submitTicket()" :loading="loading" small> שמור </v-btn>
                                <v-btn @click="dialog = false" small> בטל</v-btn>
                            </v-layout>
                        </v-col>
                    </v-card-actions>
                </div>
            </v-container>
        </v-card>
        <div class="divFooter">
            חתימה : ___________________
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            תאריך : {{ new Date().toISOString().substr(0, 10) }}
        </div>
        <customer-form ref="customerForm"/>
    </v-dialog>
</template>

<script>
import { TICKET_MODEL, TABLE_MODEL, CUSTOMER_MODEL, VAT_PERCENTAGE, NEW_TICKET } from "../constants/constants";
import apiService from "../services/apiService";
import specificServiceEndPoints from '../services/specificServiceEndPoints';
import CustomerForm from './CustomerForm.vue';
import debounce from 'debounce';

export default {
    name: "ticket-form",
    components: { CustomerForm },
    data() {
        return {
            ticket: {customerName:''},
			dialog: false,
            dateModal : false,
            dateModal2 : false,
            resolve: null,
			showMessage: false,
            search: '',
            newTicket: false,
            defectList: [],
            itemList: [],
            accessoriesList: [],
            entryConditionList: [],
            defectFoundList: [],
            defectFixesList: [],
            customers: [],
            remarkList: '',
            customerInfo: '',
            loading: false,
            menu: false,
            menu1: false,
            menu2: false,
            disableTreatment: false,
        };
    },

    methods: {
        async submitTicket() {
            this.loading = true
			try {
				if(this.newTicket) {
                    this.ticket.year = new Date(this.ticket.entryDate).getFullYear() ;
                    await apiService.create({...this.ticket} , {model:TICKET_MODEL});
				} else {
					await apiService.update(this.ticket._id , { ...this.ticket } , {model:TICKET_MODEL});
				}
                this.dialog = false;
                this.resolve(true);
			} catch (error) {
				console.log(error);
			}
            this.loading = false
		},

        debounceInput: debounce(async function (value) {
            if(value) {
                let response = await specificServiceEndPoints.searchCustomers({customer: value});
                this.customers = response.data.customers.map(item => item.fullName);
            }
        }, 500),

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

        printTicket() {
            this.dialog = false;
            setTimeout(() => {  
                this.$emit('openPrint', {ticket: this.ticket, customerInfo: this.customerInfo});                
            }, 500);
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

        async getRemarkList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 2} );
            this.remarkList = response.data.map((item) => {
                return (item.description)
            });
        },

        async getItemsList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 3} );
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
        }
    },
    watch: {
        search (val) {
            if (!val) {
                return
            }
            this.debounceInput(val)
        },

        // Whenever the customer is piked - fatch customerInfo
        async 'ticket.customerName' (newFullName) {
            if (newFullName) {
                const response = await apiService.getOne({model: CUSTOMER_MODEL, fullName:newFullName})
                this.customerInfo = response.data
                this.ticket.customerId = this.customerInfo.customerId
            }
        }
    },
    mounted() {
		this.getDefectList();
		this.getItemsList();
		this.getAccessoriesList();
		this.getEntryConditionList();
		this.getDefectFoundList();
		this.getDefectFixesList();
        this.getRemarkList();
	},
};
</script>

<style scoped>
    .overflow{
        overflow: auto;
    }
    .v-area{
        border: 1px solid black;
        border-radius: 0px;
        padding: 0px;
        margin: 0px;
    }
    .v-areaMiddle{
        border: 1px solid black;
        border-radius: 0px;
        padding: 0px;
        margin: 0px;
        height:300px;
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
            border: 1px solid black;
            border-radius: 0px;
            padding: 0px;
            margin: 0px;
            /* width:470px; */
            /* height:560px; */
        }
    }

</style>