<template>
    <v-dialog
        v-model="dialog"
        width="1000"
        @keydown.esc="dialog = false"
    >
        <v-card >
            <v-card-title class="text-h6 grey lighten-2">
                <v-btn @click="dialog = false" small><v-icon small> mdi-close </v-icon> </v-btn>
                <v-spacer></v-spacer>
                כרטיס תיקון - {{ticket.ticketId}}
            </v-card-title>
            <v-container>
                <v-row style="justify-content: center; direction: rtl; padding: 0px">
                    <!-- ------------------- Customer Area  ------------------- -->
                    <v-col cols="12" style="padding: 0px">
                        <div class="v-area">
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
                                <v-col class="px-2" cols="6" sm="2">
                                    <v-text-field type="text" :value="customerInfo.address +' '+ customerInfo.city" readonly reverse hide-details></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone1" readonly hide-details></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone3" readonly hide-details></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone2" readonly hide-details></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="openExsitingCustomerForm" style="margin-top: 15px;" x-small><v-icon small>mdi-pencil</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="px-4" dense style="font-size: smaller; color: red; margin: 0px;"> 
                                {{customerInfo.remark}}
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Item Area  ------------------- -->
                    <v-col cols="12" sm="6" style="padding: 0px">
                        <div class="v-areaMiddle">
                            <h6 class="area-header">פרטי מכשיר</h6>
                            <v-row no-gutters>
                                <v-col class="px-2" cols="6">
                                    <v-combobox v-model="ticket.item" :items="itemList" label="שם המכשיר" reverse />
                                </v-col>
                                <v-col cols="3"></v-col>
                                <v-col class="px-2" cols="3">
                                    <v-menu v-model="menu2" :close-on-content-click="false" nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.entryDate" v-bind="attrs" v-on="on" label="תאריך כניסה" reverse readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.entryDate" @input="menu2 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectDescription" :items="defectList" label="תאור התקלה" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense/>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.entryCondition" :items="entryConditionList" label="מצב המכשיר" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense/>
                                </v-col>
                                <v-col class="px-2" cols="6">
                                    <v-combobox v-model="ticket.accessories" :items="accessoriesList" label="אביזר נוסף" multiple dense/>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Treatment Area  ------------------- -->
                    <v-col cols="12" sm="6" style="padding: 0px">
                        <div class="v-areaMiddle">
                            <h6 class="area-header">פרטי טיפול</h6>
                            <v-row no-gutters>
                                <v-col class="px-2" cols="1">
                                    <v-text-field v-model="ticket.fixMin" label="דקות" reverse @focus="$event.target.select()" prepend-icon></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="1">
                                    <v-text-field v-model="ticket.fixHour" label="שעות" reverse @focus="$event.target.select()" prepend-icon></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="2">
                                    <v-text-field v-model="ticket.partsCost" label="עלות חלפים" reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col cols="5"></v-col>
                                <v-col class="px-2" cols="3">
                                    <v-menu v-model="menu1" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.fixDate" v-bind="attrs" v-on="on" label="תאריך תיקון" reverse readonly></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.fixDate" @input="menu1 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectFound" :items="defectFoundList" label="תקלות שאובחנו" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense/>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectFixes" :items="defectFixesList" label="תאור ביצוע העבודה" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense></v-combobox>
                                </v-col>
                                <v-row style="justify-content: right;">
                                    <v-col class="px-2" cols="9">
                                        <v-combobox v-model="ticket.ticketRemark" :items="ticketRemarkList" label="הערה לכרטיס - לא מודפס" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense hide-details></v-combobox>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </div>
                    </v-col>
                    <!-- ------------------- Payment Area  ------------------- -->
                    <v-col cols="12" style="padding: 0px">
                        <div class=" v-area">
                            <h6 class="area-header">פרטי תשלום</h6>
                            <v-row no-gutters>
                                <v-col class="px-2" cols="6" sm="1">
                                    <v-text-field v-model="ticket.prepaid" label="שולם מראש" reverse @focus="$event.target.select()" hide-details></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="6" sm="1">
                                    <v-text-field v-model="ticket.prepaidInvoice" label="חש' מראש" reverse @focus="$event.target.select()" hide-details></v-text-field>
                                </v-col>
                                <v-col cols="6" sm="2"></v-col>
                                <v-col class="px-2" cols="3" sm="1">
                                    <v-text-field @input="onAmountChange" v-model="ticket.amount" label="סכום" reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="1">
                                    <v-text-field v-model="ticket.vat" label="מע'מ" disabled reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="1">
                                    <v-text-field @input="onTotalChange" v-model="ticket.total" label="סה'כ" reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col cols="6" sm="2"></v-col>
                                <v-col class="px-2" cols="3" sm="1">
                                    <v-text-field  v-model="yitra" label="יתרה לתשלום" disabled reverse></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="1">
                                    <v-text-field v-model="ticket.invoice" label="חשבונית" reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="2">
                                    <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-text-field v-model="ticket.exitDate" v-bind="attrs" v-on="on" label="תאריך יציאה" reverse readonly hide-details
                                                            style="padding-top: 0px; margin-top: 0px;"/>
                                        </template>
                                        <v-date-picker v-model="ticket.exitDate" @input="menu = false"/>
                                    </v-menu>
                                </v-col>
                                <!-- <v-col cols="6" sm="5"></v-col> -->
                                <v-col class="px-2" cols="10">
                                    <v-combobox v-model="ticket.remarks" :items="remarkList" label="הערות להדפסה" multiple hide-details
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense></v-combobox>
                                </v-col>
                            </v-row>
                        </div>
                    </v-col>
                </v-row>
                <div>
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
                                <div v-if="!isMobile()">
                                    <v-btn @click="printForm(printExit = false)" small>הדפס כניסה</v-btn>
                                    <v-btn @click="printForm(printExit = true)" small>הדפס יציאה</v-btn>
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn @click="sendMessage()" small color=success> <v-icon small class="pr-2"> mdi-whatsapp </v-icon> הודעה </v-btn>
                                <v-btn @click="submitTicket()" :loading="loading" small> שמור </v-btn>
                                <v-btn @click="dialog = false" small> בטל</v-btn>
                            </v-layout>
                        </v-col>
                    </v-card-actions>
                </div>
            </v-container>
        </v-card>
        <customer-form ref="customerForm"/>
        <div>
            <PrintEntryVue :customerInfo="customerInfo" :ticket="ticket" ref="printEntryVue"/>
        </div>
        <div>
            <PrintExitVue :customerInfo="customerInfo" :ticket="ticket" ref="printExitVue"/>
        </div>
    </v-dialog>
</template>

<script>
import { TICKET_MODEL, TABLE_MODEL, CUSTOMER_MODEL, NEW_TICKET, messageTemplate, isMobile } from "../constants/constants";
import apiService from "../services/apiService";
import specificServiceEndPoints from '../services/specificServiceEndPoints';
import CustomerForm from './CustomerForm.vue';
import debounce from 'debounce';
import PrintEntryVue from './PrintEntry.vue';
import PrintExitVue from './PrintExit.vue';

export default {
    name: "ticket-form",
    components: { CustomerForm, PrintEntryVue, PrintExitVue },
    data() {
        return {
            isMobile,
            ticket: {customerName:'', ticketStatus:''},
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
            ticketRemarkList: [],
            customers: [],
            remarkList: '',
            customerInfo: '',
            loading: false,
            menu: false,
            menu1: false,
            menu2: false,
            printExit: false,
            yitra: 0,
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
                this.customerInfo.hasTicket = true
                await apiService.update(this.customerInfo._id, {...this.customerInfo}, {model:CUSTOMER_MODEL});
                this.dialog = false;
                this.resolve(true); // must !! for update the db while 'open'
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
            // console.log(ticket.ticketStatus)
            this.loading = true;
            this.dialog = true;
            this.newTicket = newTicket;
            this.ticket = newTicket ? NEW_TICKET : {...ticket};
            if(newTicket) {
                this.customerInfo = ''
                let lastTicket = await apiService.getMany({model: TICKET_MODEL , sort: {ticketId: -1 } , limit: 1});
                const { ticketId } = lastTicket.data[0];
                this.ticket.ticketId = ticketId+1
                let vatTable = await apiService.getOne({model: TABLE_MODEL, table_id: 102}) // get the current vat %
                this.ticket.vat = vatTable.data.table_code;
                this.yitra = 0;
            } else {
                this.customers.push(ticket.customerName);
                const response = await apiService.getOne({model: CUSTOMER_MODEL, fullName:ticket.customerName})
                this.customerInfo = response.data
                this.ticket.exitDate ? this.ticket.exitDate = new Date(this.ticket.exitDate).toISOString().substr(0, 10) : ''
                this.ticket.entryDate ? this.ticket.entryDate = new Date(this.ticket.entryDate).toISOString().substr(0, 10) : ''
                this.ticket.fixDate ? this.ticket.fixDate = new Date(this.ticket.fixDate).toISOString().substr(0, 10) : ''
                this.yitra = this.ticket.prepaid ? this.ticket.total-this.ticket.prepaid : 0;
            }
            this.loading = false;
            return new Promise((resolve) => { // must !! for update the db while 'submitTicket'
                this.resolve = resolve;
            });
        },

        printForm(printExit) {
            this.dialog = false;  // need to close this dialog so no print it in background
            this.submitTicket()
            setTimeout(() => {  
                // this.$emit('openPrint', {ticket: this.ticket, customerInfo: this.customerInfo, printExit});                
                printExit   ? this.$refs.printExitVue.print({ticket: this.ticket, customerInfo: this.customerInfo, printExit}) 
                            : this.$refs.printEntryVue.print({ticket: this.ticket, customerInfo: this.customerInfo, printExit});
            }, 1000);
        },

        async sendMessage() {
            try {
                if(this.customerInfo && this.customerInfo.phone1) {
                    const name = this.customerInfo.fullName || this.ticket.customerName;
                    const itemName = this.ticket.item;
                    const message = messageTemplate.replace("__name__", name).replace("__itemName__", itemName);
                    let cutomerPhone = "+972".concat(this.customerInfo.phone1.replace("-","").substring(1))
                    // console.log(cutomerPhone)
                    await specificServiceEndPoints.sendMessageToUser({message, phone: cutomerPhone});
                    alert('Message sent successfully to ' + cutomerPhone);
                    this.submitTicket();
                } else {
                    alert("User has no primary phone number");
                }
            } catch (error) {
                console.log(error);
                alert("Can't send message to user!");
            }
        },

        async openNewCustomerForm(){
			this.ticket.customerName = await this.$refs.customerForm.open(null, true);
            this.customers.push(this.ticket.customerName);
        },

        async openExsitingCustomerForm(){
			await this.$refs.customerForm.open(this.customerInfo, false);
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

        async getTicketRemarksList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 16} );
            this.ticketRemarkList = response.data.map((item) => {
                return (item.description)
            });
        },

        onAmountChange() {
            let { amount } = this.ticket;
            if(amount && amount >= 0) {
                // this.ticket.vat = ((parseFloat(amount) * VAT_PERCENTAGE)/100)
                // this.ticket.total = (this.ticket.vat + parseFloat(amount)).toFixed(0);
                this.ticket.total = (parseFloat(amount) * (1 + this.ticket.vat/100 )).toFixed(0);
            } else {
                this.ticket.amount = 0;
                // this.ticket.vat = 0;
                this.ticket.total = 0;
            }
            this.yitra = this.ticket.total-this.ticket.prepaid;
        },

        onTotalChange() {
            let { total } = this.ticket;
            if(total && total >= 0) {
                this.ticket.amount = (parseFloat(total)/(1+this.ticket.vat/100)).toFixed(0);
                // this.ticket.vat = (parseFloat(total)- this.ticket.amount).toFixed(0);
            } else {
                this.ticket.amount = 0;
                // this.ticket.vat = 0;
                this.ticket.total = 0;
            }
            this.yitra = this.ticket.total-this.ticket.prepaid;
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
        },

        // Whenever ticketStatus is change - setup the corresponding date
        // async 'ticket.ticketStatus' (newStatus) {
        //     switch (newStatus) {
        //         case 'Fixed' :
        //             this.ticket.fixDate = new Date().toISOString().substr(0, 10);
        //             break;
        //         case 'Closed' :
        //             this.ticket.exitDate = new Date().toISOString().substr(0, 10);
        //             break;                    
        //     }
        // }
    },
    mounted() {
		this.getDefectList();
		this.getItemsList();
		this.getAccessoriesList();
		this.getEntryConditionList();
		this.getDefectFoundList();
		this.getDefectFixesList();
        this.getRemarkList();
        this.getTicketRemarksList();
        this.yitra = 0;
	},
};
</script>

<style scoped>
    .overflow{
        overflow: auto;
    }
    .v-area{
        border: 1px solid blue;
        border-radius: 0px;
    }
    .v-areaMiddle{
        border: 1px solid blue;
        border-radius: 0px;
        height:250px;
        overflow-y: auto;
    }

    .area-header {
        color: blue;
        font-size: large;
        font-style:italic;
        margin-bottom: 0px !important;
    }

    .container {
        padding-bottom: 0px !important;
    }
    .h6.area-header {
        margin-bottom: 0px !important;
    }
</style>