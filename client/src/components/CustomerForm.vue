<template>
    <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        width="900"
        :scrollable = false
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="dialog = false"
    >
        <v-card class="hebrew">
            <v-card-title class="text-h6 grey lighten-2">
                <v-btn @click="dialog = false" small><v-icon small> mdi-close </v-icon> </v-btn>
                <v-spacer></v-spacer>
                כרטיס לקוח - {{ customer.fullName }}
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>
            <v-row class="pa-3 overflow-hidden">
                <v-col cols="2">
                    <v-text-field type="number" v-model="customer.customerId" label="מס' לקוח" readonly reverse></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="customer.fullName" label="שם לקוח מלא" reverse></v-text-field>
                </v-col>      
                <v-col cols="4">
                    <v-text-field v-model="customer.address" label="כתובת" reverse></v-text-field>
                </v-col>
                <v-col cols="2">
                    <v-text-field v-model="customer.city" label="עיר" reverse></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="customer.phone1" label="בית 1" reverse></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="customer.phone2" label="נוסף 2" reverse></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-text-field v-model="customer.phone3" label="נייד 3" reverse></v-text-field>
                </v-col>
                <v-col cols="4">
                    <v-combobox v-model="customer.arrivedFrom" :items="arrivedFromList" label="הגיע אלינו דרך..." reverse/>
                </v-col>
                <v-col cols="4">
                    <v-dialog ref="dialog" v-model="dateModal" :return-value.sync="customer.issueDate" persistent width="290px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="customer.issueDate" label="תאריך" readonly reverse v-bind="attrs" v-on="on" ></v-text-field>
                        </template> 
                        <v-date-picker v-model="customer.issueDate" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="$refs.dialog.save(customer.issueDate)">OK</v-btn>
                        </v-date-picker>
                    </v-dialog>
                </v-col>
                <v-col cols="12">
                    <v-textarea v-model="customer.remark" label="הערה" reverse rows="3"></v-textarea>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn v-if="customer.hasTicket" color="primary" text @click="customerTickets"> פעילות לקוח </v-btn>
                <v-spacer></v-spacer>
                <v-btn v-show="!newCustomer" color="primary" text @click="deleteCustomer(customer._id)"> מחק </v-btn>
                <v-btn color="primary" text @click="dialog = false"> סגור </v-btn>
                <v-btn color="primary" text @click="submitCustomer()" :disabled = "!customer.customerId"> שמור </v-btn>
            </v-card-actions>
        </v-card>
		<confirm-dialog ref="confirm"/>
    </v-dialog>
</template>

<script>
import { CUSTOMER_MODEL,TABLE_MODEL, TICKET_MODEL } from "../constants/constants";
import apiService from "../services/apiService";
import ConfirmDialog from './Common/ConfirmDialog.vue';

export default {
    name: "customer-form",
	components: { ConfirmDialog },
    data() {
        return {
            customer: {},
			dialog: false,
            resolve: null,  
            dateModal : false,
			showMessage: false,
            newCustomer: false,
			message: '',
            options: {
                color: "grey lighten-3",
                width: 600,
                zIndex: 200,
            },
            arrivedFromList: [],
        };
    },
    methods: {
        async submitCustomer() {
			try {
				let response;
				if(this.newCustomer) {
					response = await apiService.create({...this.customer} , {model:CUSTOMER_MODEL});
				} else {
					response = await apiService.update(this.customer._id , { ...this.customer } , {model:CUSTOMER_MODEL});
                    // now update the customerName in exsiting tickets.
                    let response2 = await apiService.getMany({model:TICKET_MODEL , customerId: this.customer.customerId})
                    response2.data.map(async(item) => {
                        item.customerName = this.customer.fullName
                        await apiService.update(item._id , { ...item } , {model:TICKET_MODEL});
                        return (item)
                    })
				}

                if(response.data && response.data.data) {
					this.message = 'עדכון/הוספה בוצע בהצלחה';
				}
                this.dialog = false;
                this.resolve(response.data.data); // bring back the whole customer object

			} catch (error) {
				console.log(error);
			}
		},
        async open(customer, newCustomer) {
            this.newCustomer = newCustomer;
            if (newCustomer) {
                this.customer = {issueDate: new Date().toISOString().substr(0, 10)}
                let lastCustomer = await apiService.getMany({model: CUSTOMER_MODEL , sort: {customerId: -1 } , limit: 1});
                this.customer.customerId = lastCustomer.data[0].customerId+1;
                this.customer.hasTicket = false;
                this.customer.ticketExist = 'Non';
            } else {
                this.customer = customer
                this.customer.issueDate = new Date(this.customer.issueDate).toISOString().substr(0, 10)
            }
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },
        async deleteCustomer(id) {
			try {
				if(id) {
					if(await this.$refs.confirm.open( "Confirm", `Are you sure to delete this customer? ${this.customer.fullName}`)){
						let params = {model:CUSTOMER_MODEL, id:id}
						let response = await apiService.deleteOne(params)
                        if(response.data && response.data.data) {
                            this.message = 'Customer successfully Deleted!';
                        }
                        this.showMessage = true;
                        setTimeout(() => {
                            this.dialog = false;
                            this.showMessage = false;
                            this.resolve(this.customer.fullName);
                        }, 2000);
					}
				}
			} catch (error) {
				console.log(error);		
			}
		},
        async getArrivedFromList() {
            let response = await apiService.getMany({model: TABLE_MODEL , table_id: 14} );
            this.arrivedFromList = response.data.map((item) => {
                return (item.description)
            });
        },
        customerTickets() {
			this.$router.push({ name: "ticket-list", params: { ticketsFilter: this.customer.customerId, ticketType: 'CUSTOMER' } });
        }
    },
    mounted() {
		this.getArrivedFromList();
    }
};
</script>

<style scoped>
.overflow-hidden{
    overflow: hidden;
    margin: 0px;
}
.hebrew {
  direction: rtl;
  /* text-align: right; */
  text-align-last: right !important
}
</style>