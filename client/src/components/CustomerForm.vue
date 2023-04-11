<template>
    <v-dialog
        v-model="dialog"
        width="600"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="dialog = false"
    >
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                {{!(Object.keys(customer).length) ? 'New' : 'Update'}} Customer
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>
                <v-row class="p-3 overflow-hidden">
                    <v-col cols="4">
                        <v-text-field type="number" v-model="customer.customerId" label="Customer ID" readonly></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="customer.fullName" label="Name"></v-text-field>
                    </v-col>      
                    <v-col cols="4">
                        <v-text-field v-model="customer.address" label="Address"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="customer.city" label="City"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="customer.phone1" label="Phone 1"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="customer.phone2" label="Phone 2"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="customer.phone3" label="Phone 3"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field v-model="customer.arrivedFrom" label="Arrived From"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-dialog ref="dialog" v-model="dateModal" :return-value.sync="customer.issueDate" persistent width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="customer.issueDate" label="Issue date" readonly v-bind="attrs" v-on="on" ></v-text-field>
                            </template> 
                            <v-date-picker v-model="customer.issueDate" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                                <v-btn text color="primary" @click="$refs.dialog.save(customer.issueDate)">OK</v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-col>
                </v-row>
            <v-divider></v-divider>
            <v-card-actions>
                <v-btn v-if="customer.hasTicket" color="primary" text @click="customerTickets"> פעילות לקוח </v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="deleteCustomer(customer._id)"> Delete </v-btn>
                <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
                <v-btn color="primary" text @click="submitCustomer()" :disabled = "!customer.customerId"> Submit </v-btn>
            </v-card-actions>
        </v-card>
		<confirm-dialog ref="confirm"/>
    </v-dialog>
</template>

<script>
import { CUSTOMER_MODEL } from "../constants/constants";
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
				}

                if(response.data && response.data.data) {
					this.message = 'Customer successfully created/updated!';
				}
                this.showMessage = true;
                setTimeout(() => {
                    this.dialog = false;
                    this.showMessage = false;
                    this.resolve(this.customer.fullName);
                }, 2000);

			} catch (error) {
				console.log(error);
			}
		},
        async open(customer, newCustomer) {
            this.newCustomer = newCustomer;
            if (newCustomer) {
                this.customer = {issueDate: new Date().toISOString().substr(0, 10)}
                let lastCustomer = await apiService.getMany({model: CUSTOMER_MODEL , sort: {customerId: -1 } , limit: 1});
                this.customer.customerId  = lastCustomer.data[0].customerId+1;
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

        customerTickets() {
			this.$router.push({ name: "ticket-list", params: { ticketsFilter: this.customer.customerId, ticketType: 'CUSTOMER' } });
        }
    },
};
</script>

<style scoped>
.overflow-hidden{
    overflow: hidden;
}
</style>