<template>
    <v-dialog
        v-model="dialog"
        width="1000"
        @keydown.esc="dialog = false"
    >
        <v-card>
            <v-card-title :class="`${ticket.ticketStatus}`" class="text-h6">
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
                                <v-col cols="6" sm="5">
                                    <!-- replaced from v-autocomplete -->
                                    <v-combobox
                                        v-model="customerNameAddress"
                                        auto-select-first
                                        :search-input.sync="search"
                                        append-icon="mdi-account-plus"
                                        :cache-items = true
                                        class="mx-3"
                                        flat
                                        hide-no-data
                                        hide-details
                                        @click:append="openNewCustomerForm"
                                        :items="customers"
                                        :item-value="customers.value"
                                        :item-text="customers.text"
                                    ></v-combobox>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone1" disabled hide-details></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone3" disabled hide-details></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="2">
                                    <v-text-field type="text" :value="customerInfo.phone2" disabled hide-details></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="openExsitingCustomerForm" style="margin-top: 15px;" x-small><v-icon small>mdi-pencil</v-icon></v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="px-4" dense style="font-size: smaller; color: red; margin: 0px; justify-content: right;"> 
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
                                    <!-- <v-combobox v-model="ticket.item" :items="tableList.itemList" label="שם המכשיר" reverse /> -->
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
                                    <v-combobox v-model="ticket.defectDescription" :items="tableList.defectList" label="תאור התקלה" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense/>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.entryCondition" :items="tableList.entryConditionList" label="מצב המכשיר" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense/>
                                </v-col>
                                <v-col class="px-2" cols="6">
                                    <v-combobox v-model="ticket.accessories" :items="tableList.accessoriesList" label="אביזר נוסף" multiple dense/>
                                </v-col>
                                <v-col cols="3"></v-col>
                                <v-col class="px-2" cols="3">
                                    <v-text-field v-model="ticket.fixPrice" :value="ticket.fixPrice" label="מחיר בדיקה" style="padding-top: 0px; margin-top: 0px;"
                                        reverse @focus="$event.target.select()"></v-text-field>
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
                                            <v-text-field v-model="ticket.fixDate" v-bind="attrs" v-on="on" label="תאריך תיקון" reverse readonly clearable></v-text-field>
                                        </template>
                                        <v-date-picker v-model="ticket.fixDate" @input="menu1 = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectFound" :items="tableList.defectFoundList" label="תקלות שאובחנו" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense/>
                                </v-col>
                                <v-col class="px-2" cols="12">
                                    <v-combobox v-model="ticket.defectFixes" :items="tableList.defectFixesList" label="תאור ביצוע העבודה" multiple 
                                    :menu-props="{ minWidth: '250', maxHeight: '300' }" dense></v-combobox>
                                </v-col>
                                <v-row style="justify-content: right;">
                                    <v-col class="px-2" cols="9">
                                        <v-combobox v-model="ticket.ticketRemark" :items="tableList.ticketRemarkList" label="הערה לכרטיס - לא מודפס" multiple 
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
                                <v-col class="px-2" cols="5" sm="1">
                                    <v-text-field v-model="ticket.prepaid" label="שולם מראש" reverse @focus="$event.target.select()" hide-details></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="5" sm="1">
                                    <v-text-field v-model="ticket.prepaidInvoice" label="חש' מראש" reverse @focus="$event.target.select()" hide-details></v-text-field>
                                </v-col>
                                <v-col v-if="!isMobile()" cols="4" sm="1"></v-col>
                                <v-col class="px-2" cols="4" sm="1">
                                    <v-text-field v-model="ticket.discountBefore" @change="onDiscountBeforeChange" label="סכום" reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="1">
                                    <v-text-field v-model="ticket.discountPrecent" @change="onDiscountPrecentChange" reverse suffix="%" @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="1">
                                    <v-text-field v-model="ticket.discountAmount" label="הנחה" disabled reverse></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="1">
                                    <v-text-field v-model="ticket.amount" label="סופי" disabled reverse></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="1">
                                    <v-text-field v-model="ticket.vat" label="מע'מ" disabled reverse></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="4" sm="1">
                                    <v-text-field v-model="ticket.total" @change="onTotalChage" label="סה'כ" reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                                <v-col v-if="!isMobile()" cols="6" sm="1"></v-col>
                                <v-col class="px-2" cols="3" sm="1">
                                    <v-text-field  v-model="yitra" label="יתרה לתשלום" disabled reverse></v-text-field>
                                </v-col>
                                <v-col class="px-2" cols="3" sm="1">
                                    <v-text-field v-model="ticket.invoice" label="חשבונית" reverse @focus="$event.target.select()"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row no-gutters>
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
                                    <v-combobox v-model="ticket.remarks" :items="tableList.remarkList" label="הערות להדפסה" multiple hide-details
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
                                <v-btn-toggle v-model="ticket.ticketStatus" group mandatory>
                                    <v-btn text value="Open"     elevation='3' small 
                                        style="border-color: red;  border-bottom-width: thick; border-inline-color: revert-layer; border-top-width: inherit;">פתוח
                                    </v-btn>
                                    <v-btn text value="Checked"  elevation='3' small
                                        style="border-color: yellow;  border-bottom-width: thick; border-inline-color: revert-layer; border-top-width: inherit;">נבדק
                                    </v-btn>                                    
                                    <v-btn text value="Fixed"    elevation='3' small
                                        style="border-color: lightgreen;  border-bottom-width: thick; border-inline-color: revert-layer; border-top-width: inherit;">תוקן
                                    </v-btn>
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
            customers: [],
            customerInfo: '',
            loading: false,
            menu: false,
            menu1: false,
            menu2: false,
            printExit: false,
            yitra: 0,
            tableList:[],
            itemList:[],
            customerId: '',
            customerNameAddress: '',
        };
    },

    methods: {
        async submitTicket() {
            this.loading = true
            this.$forceUpdate();
			try {
				if(this.newTicket) {
                    this.ticket.year = new Date(this.ticket.entryDate).getFullYear() ;
                    await apiService.create({...this.ticket} , {model:TICKET_MODEL});
				} else {
					await apiService.update(this.ticket._id , { ...this.ticket } , {model:TICKET_MODEL});
				}
                this.customerInfo.hasTicket = true
                ////////////////////////////
                let status;
                // let findTicket = await Ticket.find({customerId: this.customerInfo.customerId}) 
                let findTicket = await apiService.getMany({model: TICKET_MODEL , customerId: this.customerInfo.customerId});
                if (findTicket.data.length > 0){
                    status = this.ticket.ticketStatus
                    findTicket.data.map((item) => {
                        if (item.ticketStatus != 'Closed') status = item.ticketStatus;
                    })
                } else status = 'Non'
                this.customerInfo.ticketExist = status                
                ////////////////////////////
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
                this.customers = response.data.customers.map((item) => {
                    return ({text: item.fullName + ' - ' + item.address + (item.city ? (' - ' + item.city) : ''), value:item.customerId})
                    // return ({text: {'customerName': item.fullName, 'address': item.address}, value:item.customerId})
                });
            }
        }, 500), // this is the time-lap in ms' between each key-pressed

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
                const response = await apiService.getOne({model: CUSTOMER_MODEL, customerId:ticket.customerId})
                this.customerInfo = response.data
                this.ticket.exitDate ? this.ticket.exitDate = new Date(this.ticket.exitDate).toISOString().substr(0, 10) : ''
                this.ticket.entryDate ? this.ticket.entryDate = new Date(this.ticket.entryDate).toISOString().substr(0, 10) : ''
                this.ticket.fixDate ? this.ticket.fixDate = new Date(this.ticket.fixDate).toISOString().substr(0, 10) : ''
                this.customerNameAddress = ticket.customerName + " - " + this.customerInfo.address + (this.customerInfo.city ? (" - " +  this.customerInfo.city) : '') ;  // need this !
                this.yitra = this.ticket.prepaid ? this.ticket.total-this.ticket.prepaid : 0;
            }
            this.loading = false;
            return new Promise((resolve) => { // must !! for update the db while 'submitTicket'
                this.resolve = resolve;
            });
        },

        async printForm(printExit) {
            this.dialog = false;  // need to close this dialog so no print it in background
            await this.submitTicket()
            setTimeout(() => {  
                printExit   ? this.$refs.printExitVue.print({ticket: this.ticket, customerInfo: this.customerInfo, printExit}) 
                            : this.$refs.printEntryVue.print({ticket: this.ticket, customerInfo: this.customerInfo, printExit});
            }, 10);
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
			let newCustomer = await this.$refs.customerForm.open(null, true);
            this.customerNameAddress = newCustomer.fullName + " - " + newCustomer.address + (newCustomer.city ? (" - " +  newCustomer.city) : '') ;
            this.customerInfo = newCustomer;
            this.ticket.customerId = this.customerInfo.customerId
            this.ticket.customerName = this.customerInfo.fullName
        },

        async openExsitingCustomerForm(){
			let exsitingCustomer = await this.$refs.customerForm.open(this.customerInfo, false);
            this.customerNameAddress = exsitingCustomer.fullName + " - " + exsitingCustomer.address + 
                                        (exsitingCustomer.city ? (" - " +  exsitingCustomer.city) : '') ;
            this.customerInfo = exsitingCustomer;
            this.ticket.customerId = this.customerInfo.customerId
            this.ticket.customerName = this.customerInfo.fullName
        },

        async getTableLists() {
            let response = await specificServiceEndPoints.getTabels();
            this.tableList = response.data;
            this.itemList = response.data.itemList.map((item) => item.item);
            // console.log(this.tableList)
        },

        onTotalChage(num) {
            console.log(num)
            this.ticket.discountAmount = 0
            this.ticket.discountPrecent = 0
            this.ticket.amount = (num/(1+this.ticket.vat/100)).toLocaleString();
            this.ticket.discountBefore = this.ticket.amount
            this.yitra = num - this.ticket.prepaid;
            this.$forceUpdate();    
        },

        onDiscountPrecentChange(num) {
            this.ticket.discountAmount = this.ticket.discountBefore * num/100
            this.ticket.amount = this.ticket.discountBefore - (this.ticket.discountBefore * num/100);
            this.ticket.total = (parseFloat(this.ticket.amount) * (1 + this.ticket.vat/100 )).toFixed(0);
            this.yitra = this.ticket.total-this.ticket.prepaid;
            this.$forceUpdate(); 
        },

        onDiscountBeforeChange(num) {
            this.ticket.amount = num -  (this.ticket.discountPrecent ? (num * this.ticket.discountPrecent/100) : 0);
            this.ticket.total = (parseFloat(this.ticket.amount) * (1 + this.ticket.vat/100 )).toFixed(0);
            this.yitra = this.ticket.total-this.ticket.prepaid;
            this.$forceUpdate();            
        },
    },

    watch: {
        search (val) {
            if (!val) {
                return
            }
            this.debounceInput(val)
        },

        // Whenever the customer is piked - fatch customerInfo
        async 'customerNameAddress' (nameNAddress) {
            if (nameNAddress.value) { // avoide run first time (while open, there is no object)
                const response = await apiService.getOne({model: CUSTOMER_MODEL, customerId:nameNAddress.value})
                this.customerInfo = response.data
                this.ticket.customerId = this.customerInfo.customerId
                this.ticket.customerName = this.customerInfo.fullName
                // this.$forceUpdate();            
            }
        },

        // Whenever the Item is piked - fatch the corresponding fixPrice from the table (placed in table_code field)
        // Note, only for itemList - the structure of the tableList for itemList is "item: xxx, price: xx.xx"
        async 'ticket.item' () {
            let price = this.tableList.itemList.filter((item) => {return item.item === this.ticket.item})
            // here price is structured as "{item: xxx, price: xx.xx}"
            if (price.length === 1) { //avoide cases where the item name wasn't found (item was override by Shlomi) 
                if (this.ticket.fixPrice > 0 ) {
                    if (this.ticket.fixPrice != price[0].price ) {
                        window.alert("שים לב, מחיר בדיקה לא זהה למחיר בטבלת מכשירים")
                    }
                }else {
                    this.ticket.fixPrice = price[0].price
                }
            } // eliminate this "else" due to many case of this.   "else window.alert("שים לב, לא נקוב מחיר בדיקה")"
            // this.$forceUpdate();            
        },
    },

    // computed: {
    // },

    mounted() {
        this.yitra = 0;
        this.getTableLists();
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
        height:300px;
        overflow-y: auto;
    }

    .area-header {
        color: blue;
        font-size: large;
        font-style:italic;
        margin-bottom: 0px;
    }

    .container {
        padding-bottom: 0px;
    }
    .h6.area-header {
        margin-bottom: 0px;
    }
    .Open {
        background-color: red;
    }
    .Fixed {
        background-color: lightgreen;
    }
    .Checked {
        background-color:yellow;
    }
</style>