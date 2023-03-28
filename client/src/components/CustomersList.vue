<template>
	<div class="list row">
		<v-layout class="mt-1" row wrap>
			<v-card class="p-3 m-3">


				<!-- <v-data-table
					:headers="headers"
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
					dense
				>
					<template v-slot:top>
						<v-toolbar flat>
							<v-toolbar-title>Customers - {{customers.length}}</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" class="mx-4"	label="Search" clearable></v-text-field>
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
					<template v-slot:[`item.fullName`]="{ item }">
						<span>{{ item.name + ' ' + item.family}}</span>
					</template>
					<template v-slot:[`item.controls`]="{ item }">
						<v-btn @click="updateCustomer(item)" x-small>
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
						<v-btn  @click="deleteCustomer(item._id)" x-small>
							<v-icon small>mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table> -->

				<div class="search-wrapper">
					<v-text-field
					append-icon="mdi-magnify"
					@change="onSearch"
					label="Search..."
					single-line                
					></v-text-field>
				</div>
				<vue-virtual-table
					:config="headers"
					:data="searchedCustomers.length ? searchedCustomers : customers"
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
						<v-btn @click="updateCustomer(scope.row)" x-small>
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
						<v-btn  @click="deleteCustomer(scope.row._id)" x-small>
							<v-icon small>mdi-delete</v-icon>
						</v-btn>
					</template>

					
				</vue-virtual-table>

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
import VueVirtualTable from 'vue-virtual-table'

export default {
	name: "customers-list",
	components: { CustomerForm, ConfirmDialog,VueVirtualTable },
	data() {
		return {
			customers: [],
			showMessage: false,
			message: '',
			headers: CUSTOMER_HEADERS,
			searchedCustomers: [],
			search: '',
			loading: '',
		}
	},

	methods: {
		async getCustomers() {
			this.loading = true
			try {
				const response = await apiService.getMany({model: CUSTOMER_MODEL, limit: 99999});
				if(response.data) {
					this.customers = response.data;
				}
			} catch (error) {
				console.log(error);
			}
			this.loading = false
		},

		async updateCustomer(item) {
			let newCustomer = item ? false : true;
			await this.$refs.customerForm.open(item, newCustomer);
			this.getCustomers();
		},
		onSearch(search) {
			if(!search) {
				this.searchedCustomers = [];
				return;
			}
			this.customers.forEach(customer => {
				return Object.keys(customer).map(key => {
					if(customer[key] === search) {
						this.searchedCustomers.push(customer);
					} 
				});
			});
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
		this.$root.$on("newCustomer", () => {
			this.updateCustomer();
		});
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
.search-wrapper{
	width: 20%;
    margin: 0;
    padding: 0;
    height: 40px;
}
</style>
