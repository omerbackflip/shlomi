<template>
	<div class="row no-print">
		<v-layout class="mt-1" row wrap>
			<v-data-table
				:headers="headers"
				:items="customers"
				disable-pagination
				hide-default-footer
				fixed-header
				height="75vh"
				item-key="customerId"
				mobile-breakpoint="0"
				:search="search"
				:loading = "loading"
				loader-height = "30"
				@click:row="customerTicketsList"
				dense
				class="elevation-3 hebrew"
				:class="getSize()"
			>
				<template v-slot:top>
					<v-toolbar flat>
						<v-text-field v-model="fullName" class="mx-4" type="text" label="שם לקוח"  hide-details></v-text-field>
						<v-text-field v-model="phone" class="mx-4" type="number" label="טלפון" hide-details></v-text-field>
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
				<template v-slot:[`item.fullName`]="{ item }">
					<div style="text-align: right;">
						<td @click.stop style="font-size: large;">
							<span @click="customerForm(item)">{{ item.fullName }}</span>
						</td>
						<span v-show="item.remark" class="custRmk">{{item.remark }}</span>
					</div>
				</template>
				<template v-slot:[`item.allPhones`]="{ item }">
					<td :class = "`${item.ticketExist}`">
						<span :class="{'noTicket': !item.hasTicket}">{{ item.allPhones }}</span>
					</td>
				</template>
			</v-data-table>
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
			<v-data-table v-if="!isMobile()"
				:headers="ticketHeaders"
				:items="tickets"
				disable-pagination
				hide-default-footer
				fixed-header
				height="75vh"
				item-key="_id"
				mobile-breakpoint="0"
				:loading = "loading"
				loader-height = "30"
				@click:row="updateTicket"
				dense
				class="elevation-3 hebrew width49"
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
					<td :class="`${item.ticketStatus}`">{{ item.ticketStatus }}</td>
				</template>
			</v-data-table>
		</v-layout>
		<customer-form ref="customerForm"/>
		<confirm-dialog ref="confirm"/>
		<ticket-form ref="ticketForm"/>
	</div>
</template>



<script>
import { CUSTOMER_MODEL, isMobile, TICKET_MODEL, TICKET_SHORT_HEADERS} from "../constants/constants";
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
	name: "customers-list",
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
			search: '',
			loading: false,
			// hasTicket: 2, // 0=hasTicket   1=noTicket   2=all
			ticketHeaders: TICKET_SHORT_HEADERS,
			customerName: '',
			customerRemark: '',
			fullName: '',
			phone: '',
		}
	},

	computed: {
		headers() { 
			if (isMobile()) {
				return [
				{ text: 'שם לקוח', value: 'fullName', align:'end', class: 'primary white--text', width: '50%', 
					filter: f => { return ( f + '' ).includes( this.fullName ) }},
				{ text: 'טלפונים', value: 'allPhones' , align:'start', class: 'primary white--text', width: '50%',
					filter: f => { return ( f + '' ).includes( this.phone ) }},
				];
			} else {
				return [
				{ text: 'שם לקוח', value: 'fullName', align:'end', class: 'primary white--text', width: '20%', 
					filter: f => { return ( f + '' ).includes( this.fullName ) }},
				{ text: 'כתובת', value: 'address' ,align:'end', class: 'primary white--text', width: '20%'},
				{ text: 'טלפונים', value: 'allPhones' , align:'end', class: 'primary white--text', width: '60%',
					filter: f => { return ( f + '' ).includes( this.phone ) }},
				];				
			}
		}
	},	

	methods: {
		async getCustomers() {
			this.loading = true
			try {
				// const response = await specificServiceEndPoints.getCustomersWithStatus();
				const response = await apiService.getMany({model: CUSTOMER_MODEL});
				if(response.data) {
					this.customers = response.data;
					this.customers = this.customers.map((item) => {
						let allPhones = (item.phone1 ? item.phone1.replace("-","") : '') + 
										(item.phone2 ? ' / ' + item.phone2.replace("-","") : '') +
										(item.phone3 ? ' / ' + item.phone3.replace("-","") : '')
						return ({...item, allPhones: allPhones}) 
					})
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
			this.loading = true;
			let tickets = await apiService.getMany({model: TICKET_MODEL, customerId:item.customerId})
			this.tickets = tickets.data
			if (item.hasTicket) {
				this.customerName = item.fullName
				this.customerRemark = item.remark
			} else {
				this.customerName = '';
				this.customerRemark = '';
			}
			if (this.tickets.length === 1) this.updateTicket(this.tickets[0])
			this.loading = false;
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
			await this.$refs.ticketForm.open(item, false);
		},

		getSize() {
			let calsses 
			calsses = isMobile() ? 'width100': 'width49' 
			return (calsses)
		},

		custClass(item) {
			return item.ticketExist;			
		}
	},

	mounted() {
		this.getCustomers();
	},

	watch: {
	},
};
</script>

<style scoped>
.row {
	justify-content: space-around;
	cursor: pointer;
	direction: rtl;
	padding: 0%;
}
.field-margin{
	margin: 12px;
}

.search-wrapper{
    margin: 0;
    padding: 0;
    height: 40px;
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
.custRmk{
	font-size: large;
	color: red;
	/* text-align: justify; */
}
.hebrew {
  direction: rtl;
  text-align-last: right !important
}
@media print {  /* Very important to remove background in print mode */
    .no-print {
        display: none;
    }
}
/* td {     this td was remarked becasue it's influance the size of the printExit.vue font-size
	font-size: larger;
} */

.width49 {
	max-width: 49%;
	padding: 0%;
	margin: 0%;
}

.width100 {
	max-width: 100%;
	padding: 0%;
	margin: 0%;
}

.Open {
	background-color: red;
	color: white;
}

.Fixed {
	background-color: lightgreen;
}
.Checked {
	background-color: yellow;
}
.noTicket {
	color: navajowhite;
}
</style>