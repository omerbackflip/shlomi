<template>
    <v-dialog
        v-model="dialog"
        width="1600"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="cancel"
    >
        <v-card class="overflow-hidden">
            <v-card-title class="text-h5 grey lighten-2">
                {{!(ticket.ticketId) ? 'New' : 'Update'}} Ticket - {{ticket.ticketId}}
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>

            <v-container>
                <v-row no-gutters>
                    <v-col cols="12" sm="6" lg="6" md="6">
                        <!-- ------------------- Customer Area  ------------------- -->
                        <div class="customer-area v-area">
                            <h4 class="area-header">
                                Customer Area
                            </h4>
                            <v-row no-gutters>
                                <v-col cols="12" sm="6" lg="6" md="6">
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
                                <v-col cols="12" sm="6" lg="6" md="6">
                                    <v-text-field type="text" v-model="ticket.customerAddress" label="Address"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
                                <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                    <v-text-field type="number" v-model="ticket.phone1" label="Phone 1"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" lg="6" md="6">
                                    <v-text-field type="number" v-model="ticket.phone2" label="Phone 2"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>
                        <!-- ------------------- End Customer Area  ------------------- -->
                    </v-col>

                    <v-col cols="12" sm="6" lg="6" md="6">
                            <!-- ------------------- Item Area  ------------------- -->
                            <div class="item-area v-area">
                                <h4 class="area-header">
                                    Item Area
                                </h4>
                                <v-row no-gutters>
                                    <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                        <v-combobox chips v-model="ticket.item" :items="itemList" label="Item"></v-combobox>
                                    </v-col>
                                    <v-col cols="12" sm="6" lg="6" md="6">
                                        <v-combobox  
                                            v-model="ticket.accessories" 
                                            :items="accessoriesList" 
                                            label="Accessories" 
                                            multiple 
                                            chips
                                        />
                                    </v-col>
                                    <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                        <v-combobox chips v-model="ticket.entryCondition" :items="entryConditionList" label="Entry Condition" multiple></v-combobox>
                                    </v-col>
                                    <v-col cols="12" sm="6" lg="6" md="6">
                                        <v-combobox chips v-model="ticket.defectDescription" :items="defectList" label="Defect description" multiple></v-combobox>
                                    </v-col>
                                </v-row>
                            </div>

                            <!-- ------------------- End Item Area  ------------------- -->
                    </v-col>
                    <v-col cols="12" sm="6" lg="6" md="6">
                        <!-- ------------------- Payment Area  ------------------- -->
                            <div class="payment-area v-area">
                                <h4 class="area-header">
                                    Payment Area
                                </h4>
                                <v-row no-gutters>
                                    <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                        <v-text-field type="number" v-model="ticket.checkPrice" label="Check price"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" lg="6" md="6">
                                        <v-text-field type="number" v-model="ticket.prepaid" label="Pre-paid"></v-text-field>
                                    </v-col>

                                    <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                        <v-text-field v-model="ticket.invoice" label="Invoice ID"></v-text-field>
                                    </v-col>

                                    <v-col cols="12" sm="6" lg="6" md="6">
                                        <v-text-field type="number" v-model="ticket.discountPrice" label="Discount price"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        <!-- ------------------- End Payment Area  ------------------- -->
                    </v-col>

                    <v-col cols="12" sm="6" lg="6" md="6">

                    <!-- ------------------- Treatment Area  ------------------- -->
                        <div class="treatment-area v-area">
                            <h4 class="area-header">
                                Treatment Area
                            </h4>
                            <v-row no-gutters>
                                <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                    <v-combobox chips v-model="ticket.defectsFound" :items="[]" label="Defects Found" multiple></v-combobox>
                                </v-col>
                                <v-col cols="12" sm="6" lg="6" md="6">
                                    <v-combobox chips v-model="ticket.defectFixes" :items="[]" label="Defect Fixes" multiple></v-combobox>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                    <v-menu offset-y>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-on="on" label="Entry Date" v-model="ticket.entryDate" readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.entryDate"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12" sm="6" lg="6" md="6">
                                    <v-menu offset-y>
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-on="on" label="Exit Date" v-model="ticket.exitDate" readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.exitDate"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col class="pl-2 pr-2" cols="12" sm="6" lg="6" md="6">
                                    <v-text-field v-model="ticket.remarks" label="Remark"></v-text-field>
                                </v-col>
                            </v-row>
                        </div>

                    <!-- ------------------- End Treatment Area  ------------------- -->
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
                    <!-- <v-btn color="success" text @click="dialog = false"> Close Ticket</v-btn> -->
                    <v-btn :disabled = "!ticket.customerName" color="primary" text @click="submitTicket()"> Save </v-btn>
            </v-card-actions>
        </v-card>
        <customer-form ref="customerForm"/>
    </v-dialog>
</template>

<script>
import { TICKET_MODEL, TABLE_MODEL } from "../constants/constants";
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
			message: '',
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
        };
    },

    methods: {
        async submitTicket() {
			try {
				let response;
				if(this.newTicket) {
                    let lastTicket = await apiService.getMany({model: TICKET_MODEL , sort: {ticketId: -1 } , limit: 1});
                    const { ticketId } = lastTicket.data[0];
                    response = await apiService.create({...this.ticket, ticketId: ticketId+1} , {model:TICKET_MODEL});
				} else {
					response = await apiService.update(this.ticket._id , { ...this.ticket } , {model:TICKET_MODEL});
				}

                if(response.data && response.data.data) {
					this.message = 'Ticket successfully created/updated!';
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

    /deep/ .v-chip{
        border-radius: 5px !important;
        font-size: 10px !important;
        height: 18px !important;
    }
</style>