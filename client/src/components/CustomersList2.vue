<template>
	<div class="row no-print">
		<v-layout class="mt-1" row wrap>
			<v-card class="p-3 m-3" max-width="50%">
				<v-data-table
					:headers="headers"
					:items="customers"
					disable-pagination
					hide-default-footer
					fixed-header
					height="73vh"
					item-key="customerId"
					mobile-breakpoint="0"
					:loading = "loading"
					loader-height = "30"
					@click:row="customerTicketsList"
					dense
					class="elevation-3 hebrew"
				>
					<template v-slot:top>
						<v-toolbar flat>
							<!-- <v-toolbar-title>{{customers.length}}</v-toolbar-title> -->
							<!-- <v-text-field v-model="search" class="mx-4"	label="Search" clearable></v-text-field> -->
							<!-- <v-radio-group v-model="hasTicket" row dense style="direction: rtl;">
								<v-radio label="בעלי כרטיס" ></v-radio>
								<v-radio label="ללא כרטיס" ></v-radio>
								<v-radio label="כולם" ></v-radio>
							</v-radio-group> -->
							<v-spacer></v-spacer>
							<export-excel :data="customers" type="xlsx" name="customers">
								<v-btn small class="btn btn-danger mt-1 ml-3" :loading="loading">
									<v-icon >mdi-download</v-icon>
								</v-btn>
							</export-excel>
							<v-btn @click="customerForm()" small class="mt-1">
								<v-icon class="nav-icon" small >mdi-plus</v-icon>
								<div v-if="!isMobile()"> הוסף לקוח חדש </div>
							</v-btn>
						</v-toolbar>
					</template>
					<template v-slot:body.prepend>
						<tr>
							<td>
								<v-text-field v-model="fullName" type="text" label="שם לקוח"></v-text-field>
							</td>
							<td>
								<v-text-field v-model="phone1" type="text" label="בית1"></v-text-field>
							</td>
							<td>
								<v-text-field v-model="phone2" type="text" label="נייד3"></v-text-field>
							</td>
							<td>
								<v-text-field v-model="phone3" type="text" label="נוסף2"></v-text-field>
							</td>
						</tr>
					</template>
					<template v-slot:[`item.fullName`]="{ item }">
					<div :class="{'bg-green': item.hasTicket}" @click="customerForm(item)">
						<span>{{ item.fullName }}</span>
						<span v-show="item.remark" class="custRmk">{{' - ' + item.remark }}</span>
					</div>
					</template>
				</v-data-table>
				<!-- <v-btn @click="updateHasTickets">Script</v-btn> -->
				<!-- <vue-virtual-table
					:config="headersVD"
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
				<!-- <v-btn @click="updateHasTickets" :loading="loading">Run HasTicket Script</v-btn> -->
			</v-card>
			<v-card class="p-3 m-3" max-width="45%">
				<v-data-table
					:headers="ticketHeaders"
					disable-pagination
					hide-default-footer
					fixed-header
					height="73vh"
					:items="tickets"
					item-key="_id"
					mobile-breakpoint="0"
					:loading = "loading"
					loader-height = "30"
					@click:row="updateTicket"
					dense
					class="elevation-3 hebrew"
				>
					<template v-slot:top>
						<v-toolbar flat style="font-size: xx-large;">
							<v-toolbar-title>{{ customerName }}</v-toolbar-title>
						</v-toolbar>
					</template>
					<template v-slot:[`item.entryDate`]="{ item }">
						<span>{{ item.entryDate ? new Date(item.entryDate).toLocaleDateString('en-GB') : '-'}}</span>
					</template>
					<template v-slot:[`item.ticketStatus`]="{ item }">
						<div :class="{'bg-green': (item.ticketStatus!='Closed')}">{{ item.ticketStatus }}</div>
					</template>
				</v-data-table>
			</v-card>
		</v-layout>
		<customer-form ref="customerForm"/>
		<confirm-dialog ref="confirm"/>
		<ticket-form ref="ticketForm"/>
	</div>
</template>



<script>
// import { CUSTOMER_HEADERS, CUSTOMER_MODEL, isMobile, TICKET_MODEL, TICKET_SHORT_HEADERS} from "../constants/constants";
import {CUSTOMER_MODEL, isMobile, TICKET_MODEL, TICKET_SHORT_HEADERS} from "../constants/constants";
// import { CUSTOMER_HEADERS, CUSTOMER_MODEL, isMobile } from "../constants/constants";
import apiService from "../services/apiService";
import CustomerForm from './CustomerForm.vue';
import TicketForm from './TicketForm.vue';
import ConfirmDialog from './Common/ConfirmDialog.vue';
import specificServiceEndPoints from '../services/specificServiceEndPoints';
// import VueVirtualTable from 'vue-virtual-table'
import excel from "vue-excel-export";
import Vue from "vue";
Vue.use(excel);
export default {
	name: "customers-list2",
	// components: { CustomerForm, ConfirmDialog,VueVirtualTable },
	components: { CustomerForm, ConfirmDialog, TicketForm },
	data() {
		return {
			isMobile,
			customers: [],
			tickets: [],
			showMessage: false,
			message: '',
			// headers: CUSTOMER_HEADERS,
			// headersVD: CUSTOMER_HEADERS,
			headers : [
				{ text: 'שם לקוח', value: 'fullName', align:'end', class: 'primary white--text', width: '20%', 
					filter: f => { return ( f + '' ).includes(this.fullName) }},
				{ text: 'בית 1', value: 'phone1' , align:'end', class: 'primary white--text', width: '15%',
					filter: f => { return ( f + '' ).includes(this.phone1) }},
				{ text: 'נייד 3', value: 'phone3' , align:'end', class: 'primary white--text', width: '15%',
					filter: f => { return ( f + '' ).includes(this.phone3) }},
				{ text: 'נוסף 2', value: 'phone2' , align:'end', class: 'primary white--text', width: '15%',
					filter: f => { return ( f + '' ).includes(this.phone2) }},
			],
			loading: false,
			hasTicket: 2, // 0=hasTicket   1=noTicket   2=all
			ticketHeaders: TICKET_SHORT_HEADERS,
			customerName: '',
			customerRemark: '',
			fullName: '',
			phone1: '',
			phone2: '',
			phone3: '',
		}
	},

	methods: {
		async getCustomers() {
			this.loading = true
			try {
				const response = await apiService.getMany({model: CUSTOMER_MODEL});
				// const response = await apiService.getMany({model: CUSTOMER_MODEL , hasTicket: this.hasTicket === 0 ? true 
				// 																				: (this.hasTicket === 1 ? false 
				// 																				: [true,false])});
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

		async customerTicketsList(item) {
			if (item.hasTicket) {
				let tickets = await apiService.getMany({model: TICKET_MODEL, customerId:item.customerId})
				this.tickets = tickets.data
				this.customerName = item.fullName
				this.customerRemark = item.remark
			} else {
				this.customerName = '';
				this.customerRemark = '';
			}
		},

		async deleteCustomer(id) {
			try {
				if(id) {
					if(await this.$refs.confirm.open( "Confirm", "בטוח שאתה רוצה למחוק את הלקוח הזה")){
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
		},

		async updateTicket(item) {
			if (this.customerName) await this.$refs.ticketForm.open(item, false);
		},

		itemRowBackground(item) {
			let classes = item.hasTicket ? "bg-green" : ""
			return classes
		},
	},

	mounted() {
		this.getCustomers();
		// this.$root.$on("newCustomer", () => {
		// 	this.customerForm();
		// });
	},

	watch: {
		// hasTicket() {
		// 	this.getCustomers();
		// },
	},
};
</script>

<style scoped>
.row {
	justify-content: space-around;
	cursor: pointer;
	direction: rtl;
}
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
.v-toolbar__title {
        white-space: pre-wrap !important;
        font-size: smaller !important;
    }
.v-toolbar__content {
	padding-right: 0px !important;
	font-size: xxx-large !important;
    place-content: center !important;
}
.v-label {
	font-size: smaller !important;
}
.bg-green {
  background-color: lightgreen !important;
	text-align: justify;
}
.custRmk{
	color: red;
	font-size: smaller;
	text-align: justify;
}
.hebrew {
  direction: rtl;
  /* text-align: right; */
  text-align-last: right !important
}
@media print {  /* Very important to remove background in print mode */
    .no-print {
        display: none;
    }
}
</style>