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
            <v-row class="p-4">
                <v-col cols="4">
                    <v-autocomplete
                        v-model="ticket.customerName" 
                        label="Customer Name"
                        :search-input.sync="search"
                        append-icon="mdi-account"
                        @click:append="getCustomer"
                        :items="customers"
                    ></v-autocomplete>
                </v-col>
                <v-col cols="4">
                    <v-dialog ref="dialog" v-model="dateModal" :return-value.sync="ticket.entryDate" persistent width="290px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field 
                            v-model="ticket.entryDate"
                            label="Entry date"
                            readonly
                            v-bind="attrs"
                            v-on="on" >
                            </v-text-field>
                        </template> 
                        <v-date-picker v-model="ticket.entryDate" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.dialog.save(ticket.entryDate)">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>
                </v-col>
                <v-col cols="4">
                    <v-combobox v-model="ticket.item" :items="itemList" label="Item"></v-combobox>
                </v-col>
                <v-col cols="4">
                    <v-combobox v-model="ticket.defectDescription" :items="defectList" label="Defect description" multiple></v-combobox>
                </v-col>
                <v-col cols="4">
                    <v-combobox v-model="ticket.accessories" :items="accessoriesList" label="Accessories" multiple></v-combobox>
                </v-col>
                <v-col cols="4">
                    <v-combobox v-model="ticket.entryCondition" :items="entryConditionList" label="Entry Condition" multiple></v-combobox>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="ticket.checkPrice" label="Check price"></v-text-field>
                </v-col>
                <v-col cols="4"> 
                    <v-text-field v-model="ticket.prepaid" label="Pre-paid"></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="ticket.discountPrice" label="Discount price"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="ticket.remarks" label="Remark"></v-text-field>
                </v-col>                           
            </v-row>
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
    </v-dialog>
</template>

<script>
import { TICKET_MODEL, TABLE_MODEL } from "../constants/constants";
import apiService from "../services/apiService";
import specificServiceEndPoints from '../services/specificServiceEndPoints';
import debounce from 'debounce';

export default {
    name: "ticket-form",
    data() {
        return {
            ticket: {},
			dialog: false,
            dateModal : false,
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
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },
        getCustomer(){
            window.alert("here need to fetch a customer")
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
</style>