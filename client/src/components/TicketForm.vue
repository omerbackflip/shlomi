<template>
    <v-dialog
        v-model="dialog"
        width="1200"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="cancel"
    >
        <v-card class="overflow-hidden">
            <v-card-title class="text-h5 grey lighten-2">
                {{!(ticket.ticketId) ? 'New' : 'Update'}} Ticket - {{ticket.ticketId}}
            </v-card-title>
            <v-container>
                <v-row no-gutters>
                    <!-- ------------------- Customer Area  ------------------- -->
                    <v-layout justify-center>
                    <!-- <v-col cols="12" sm="6" lg="10" md="6"> -->
                        <div class="customer-area v-area">
                        <v-row>
                            <h4 class="area-header"> Customer Area </h4>
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
                                <v-text-field label="Address" v-model="customerInfo.address"></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field label="City" v-model="customerInfo.city"></v-text-field>
                            </v-col>
                            <v-col cols="3">                            
                                <v-text-field label="Arrived from" v-model="customerInfo.arrivedFrom"></v-text-field>
                            </v-col>                            <v-col cols="3">                            
                                <v-text-field label="Phone1" v-model="customerInfo.phone1"></v-text-field>
                            </v-col>
                            <v-col cols="3">                            
                                <v-text-field label="Phone2" v-model="customerInfo.phone2"></v-text-field>
                            </v-col>
                            <v-col cols="3">                            
                                <v-text-field label="Phone3" v-model="customerInfo.phone3"></v-text-field>
                            </v-col>
                        </v-row>
                        </div>
                    <!-- </v-col> -->
                    </v-layout>

                    <!-- ------------------- Item Area  ------------------- -->
                    <v-col cols="12" sm="6" lg="6" md="6">
                        <div class="item-area v-area">
                            <h4 class="area-header"> Item Area </h4>
                            <v-combobox v-model="ticket.item" :items="itemList" label="Item"></v-combobox>
                            <v-combobox v-model="ticket.accessories" :items="accessoriesList" label="Accessories" multiple></v-combobox>
                            <v-combobox v-model="ticket.entryCondition" :items="entryConditionList" label="Entry Condition" multiple></v-combobox>
                            <v-combobox v-model="ticket.defectDescription" :items="defectList" label="Defect description" multiple></v-combobox>
                            </div>
                    </v-col>

                    <!-- ------------------- Treatment Area  ------------------- -->
                    <v-col cols="12" sm="6" lg="6" md="6">
                        <div class="treatment-area v-area">
                            <h4 class="area-header"> Treatment Area </h4>
                            <v-combobox v-model="ticket.defectsFound" :items="[]" label="Defects Found" multiple></v-combobox>
                            <v-combobox v-model="ticket.defectFixes" :items="[]" label="Defect Fixes" multiple></v-combobox>
                            <v-dialog ref="dialog" v-model="dateModal" :return-value.sync="ticket.fixDate" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field 
                                    v-model="ticket.fixDate"
                                    label="Entry date"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on" >
                                    </v-text-field>
                                </template> 
                                <v-date-picker v-model="ticket.fixDate" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialog.save(ticket.fixDate)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                            <v-dialog ref="dialog" v-model="dateModal" :return-value.sync="ticket.exitDate" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field 
                                    v-model="ticket.exitDate"
                                    label="Entry date"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on" >
                                    </v-text-field>
                                </template> 
                                <v-date-picker v-model="ticket.exitDate" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialog.save(ticket.exitDate)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                            <v-text-field v-model="ticket.remarks" label="Remark"></v-text-field>
                        </div>
                    </v-col>

                    <!-- ------------------- Payment Area  ------------------- -->
                    <v-col cols="12" sm="6" lg="6" md="6">
                        <div class="payment-area v-area">
                            <h4 class="area-header"> Payment Area </h4>
                            <v-text-field v-model="ticket.checkPrice" label="Check price"></v-text-field>
                            <v-text-field v-model="ticket.prepaid" label="Pre-paid"></v-text-field>
                            <v-text-field v-model="ticket.invoice" label="Invoice ID"></v-text-field>
                            <v-text-field v-model="ticket.discountPrice" label="Discount price"></v-text-field>
                            <v-text-field v-model="ticket.discountPrice" label="Discount price"></v-text-field>
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
import { TICKET_MODEL, TABLE_MODEL, CUSTOMER_MODEL } from "../constants/constants";
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
            customers: [],
            customerInfo: '',
            loading: false,
        };
    },

    methods: {
        async submitTicket() {
            this.loading = true
			try {
				if(this.newTicket) {
                    let lastTicket = await apiService.getMany({model: TICKET_MODEL , sort: {ticketId: -1 } , limit: 1});
                    const { ticketId } = lastTicket.data[0];
                    await apiService.create({...this.ticket, ticketId: ticketId+1} , {model:TICKET_MODEL});
				} else {
                    console.log(this.ticket)
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
        padding: 12px;
        margin: 12px;
    }
</style>