<template>
    <v-dialog
        v-model="dialog"
        width="500"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="cancel"
    >
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                {{!customer ? 'New' : 'Update'}} Customer
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>

                   <v-row class="p-3 overflow-hidden">
                        <v-col cols="4" sm="6" md="4">
                            <v-text-field v-model="customer.customerId" label="Customer ID"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="customer.name" label="Name"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="customer.family" label="Family"></v-text-field>
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
                                    <v-text-field 
                                    v-model="customer.issueDate"
                                    label="Issue date"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on" >
                                    </v-text-field>
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
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
                <v-btn :disabled = "!customer.customerId" color="primary" text @click="submitCustomer()"> Submit </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { CUSTOMER_MODEL } from "../constants/constants";
import apiService from "../services/apiService";

export default {
    name: "customer-form",
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
                width: 500,
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
                    this.resolve(true);
                }, 2000);

			} catch (error) {
				console.log(error);
			}
		},
        open(customer, newCustomer) {
            this.newCustomer = newCustomer;
            this.customer = newCustomer ? {} : {...customer};
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
}
</style>