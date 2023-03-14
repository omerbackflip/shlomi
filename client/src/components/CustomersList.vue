<template>
	<div class="list row">
		<v-layout class="mt-1" row wrap>
			<v-card class="p-3 m-3">
				<v-data-table
					:headers="headers"
					disable-pagination
					hide-default-footer
					fixed-header
					height="75vh"
					:items="customers"
					item-key="customerId"
					mobile-breakpoint="0"
				>
					<template v-slot:top>
						<v-toolbar flat>
							<v-toolbar-title>Customers - {{customers.length}}</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-btn @click="updateCustomer()" small class="mt-3">
								<v-icon class="nav-icon" small >mdi-plus</v-icon>
								Add Customer
							</v-btn>
						</v-toolbar>
					</template>
					<template v-slot:[`item.issueDate`]="{ item }">
						<span>{{ item.issueDate ? new Date(item.issueDate).toDateString() : ''}}</span>
					</template>
					<template v-slot:[`item.controls`]="{ item }">
						<v-btn @click="updateCustomer(item)" x-small>
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
						<v-btn  @click="deleteCustomer(item._id)" x-small>
							<v-icon small>mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
			</v-card>
		</v-layout>
		<customer-form ref="customerForm"/>
		<confirm-dialog ref="confirm"/>
	</div>
</template>



<script>
import { CUSTOMER_HEADERS, CUSTOMER_MODEL, } from "../constants/constants";
import apiService from "../services/apiService";
import CustomerForm from './CustomerForm.vue';
import ConfirmDialog from './Common/ConfirmDialog.vue';

export default {
	name: "customers-list",
	components: { CustomerForm, ConfirmDialog },
	data() {
		return {
			customers: [],
			showMessage: false,
			message: '',
			headers: CUSTOMER_HEADERS,
		}
	},

	methods: {
		async getCustomers() {
			try {
				const response = await apiService.getMany({model: CUSTOMER_MODEL});
				if(response.data) {
					this.customers = response.data;
				}
			} catch (error) {
				console.log(error);
			}
		},

		async updateCustomer(item) {
			let newCustomer = item ? false : true;
			await this.$refs.customerForm.open(item, newCustomer);
			this.getCustomers();
		},

		async deleteCustomer(id) {
			try {
				if(id) {
					if(await this.$refs.confirm.open( "Confirm", "Are you sure to delete this customer?")){
						let params = {model:CUSTOMER_MODEL, id:id}
						await apiService.deleteOne(params)
						this.getCustomers();
					}
				}
			} catch (error) {
				console.log(error);		
			}
		},

	},

	mounted() {
		this.getCustomers();
	},
};
</script>

<style>

.field-margin{
	margin: 12px;
}

.expanded-datatable{
	width: 100%;
    margin: 12px;
    border: 10px solid #98e983;
	cursor: pointer;
}

.v-data-table__expanded{
	text-align: -webkit-center;
}

</style>
