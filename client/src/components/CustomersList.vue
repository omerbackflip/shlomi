<template>
	<div class="list row">
		<v-layout class="mt-1" row wrap>
			<v-card class="p-3 m-3">

				<v-data-table
					:headers="headersVD"
					disable-pagination
					hide-default-footer
					fixed-header
					height="75vh"
					:items="customers"
					item-key="customerId"
					mobile-breakpoint="0"
					:search="search"
					:loading = "loading"
					loader-height = "30"
					@click:row="customerForm"
					dense
				>
					<template v-slot:top>
						<v-toolbar flat>
							<v-toolbar-title>Customers - {{customers.length}}</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" class="mx-4"	label="Search" clearable></v-text-field>
							<v-radio-group v-model="hasTicket" row>
								<v-radio label="בעלי כרטיס" :value=true></v-radio>
								<v-radio label="ללא כרטיס" :value=false></v-radio>
							</v-radio-group>
							<v-spacer></v-spacer>
							<v-btn @click="customerForm()" small class="mt-3">
								<v-icon class="nav-icon" small >mdi-plus</v-icon>
								Add Customer
							</v-btn>
						</v-toolbar>
					</template>
					<!-- <template v-slot:[`item.issueDate`]="{ item }">
						<span>{{ item.issueDate ? new Date(item.issueDate).toDateString() : ''}}</span>
					</template>
					<template v-slot:[`item.controls`]="{ item }">
						<v-btn @click="customerForm(item)" x-small>
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
						<v-btn  @click="deleteCustomer(item._id)" x-small>
							<v-icon small>mdi-delete</v-icon>
						</v-btn>
					</template> -->
				</v-data-table>

				<!-- <vue-virtual-table
					:config="headers"
					:data="customers"
					:height="800"			
					:itemHeight="55"
					:minWidth="1000"
					:enableExport="true"
					class="mt-2"
					language = 'en'
				>

					<template slot-scope="item" slot="issueDate">
						<span>{{ item.row.issueDate ? new Date(item.row.issueDate).toDateString() : ''}}</span>
					</template>
					<template slot-scope="scope" slot="name">
						<div>{{ scope.row.name + ' ' + scope.row.family}}</div>
					</template>

					<template slot-scope="scope" slot="actionCommon">
						<v-btn @click="customerForm(scope.row)" x-small>
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
						<v-btn  @click="deleteCustomer(scope.row._id)" x-small>
							<v-icon small>mdi-delete</v-icon>
						</v-btn>
					</template>
				</vue-virtual-table> -->
				<v-btn @click="updateHasTickets" :loading="loading">Run HasTicket Script</v-btn>
			</v-card>
		</v-layout>
		<customer-form ref="customerForm"/>
		<confirm-dialog ref="confirm"/>
	</div>
</template>



<script>
import { CUSTOMER_HEADERS, CUSTOMER_HEADERS_VD, CUSTOMER_MODEL } from "../constants/constants";
import apiService from "../services/apiService";
import CustomerForm from './CustomerForm.vue';
import ConfirmDialog from './Common/ConfirmDialog.vue';
import specificServiceEndPoints from '../services/specificServiceEndPoints';
// import VueVirtualTable from 'vue-virtual-table'

export default {
	name: "customers-list",
	// components: { CustomerForm, ConfirmDialog,VueVirtualTable },
	components: { CustomerForm, ConfirmDialog },
	data() {
		return {
			customers: [],
			showMessage: false,
			message: '',
			headers: CUSTOMER_HEADERS,
			headersVD: CUSTOMER_HEADERS_VD,
			search: '',
			loading: false,
			hasTicket: true,
		}
	},

	methods: {
		async getCustomers() {
			this.loading = true
			try {
				const response = await apiService.getMany({model: CUSTOMER_MODEL , hasTicket: this.hasTicket});
				if(response.data) {
					this.customers = response.data;
				}
			} catch (error) {
				console.log(error);
			}
			this.loading = false
		},

		async customerForm(item) {
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

		async updateHasTickets() {
			await specificServiceEndPoints.hasTicketsBulk()
		}
	},

	mounted() {
		this.getCustomers();
		// this.$root.$on("newCustomer", () => {
		// 	this.customerForm();
		// });
	},

	watch: {
		hasTicket() {
			this.getCustomers();
		},
	},
};
</script>

<style>

.field-margin{
	margin: 12px;
}

.search-wrapper{
	/* width: 20%; */
    margin: 0;
    padding: 0;
    height: 40px;
}
.header-cell-inner[data-v-55a76cbe] {
    word-break: normal;
}
</style>
