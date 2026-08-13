<template>
	<div class="row no-print">
		<v-layout class="mt-1" row wrap>
			<v-data-table
				:headers="headers"
				:items="filteredCustomers"
				disable-pagination
				hide-default-footer
				fixed-header
				height="75vh"
				item-key="customerId"
				mobile-breakpoint="0"
				:loading = "loading"
				loader-height = "30"
				@click:row="customerTicketsList"
				dense
				class="elevation-3 hebrew"
				:class="isMobile() ? 'width100' : 'width49'"
			>
				<template v-slot:top>
					<v-toolbar flat>
						<v-text-field v-model="fullName" class="mx-4" type="text" label="שם לקוח"  hide-details clearable></v-text-field>
						<v-text-field v-model="phone" class="mx-4" label="טלפון" hide-details clearable></v-text-field>
						<v-spacer></v-spacer>
						<export-excel :data="$formatDataForExport(customers)" type="xlsx" name="customers">
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
		<ticket-form ref="ticketForm"/>
	</div>
</template>



<script>
import { CUSTOMER_MODEL, isMobile, TICKET_MODEL, TICKET_SHORT_HEADERS} from "../constants/constants";
import apiService from "../services/apiService";
import CustomerForm from './CustomerForm.vue';
import TicketForm from './TicketForm.vue';

export default {
	name: "customers-list",
	components: { CustomerForm, TicketForm },
	data() {
		return {
			isMobile,
			customers: [],
			tickets: [],
			loading: false,
			ticketHeaders: TICKET_SHORT_HEADERS,
			customerName: '',
			fullName: '',
			phone: '',
		}
	},

	computed: {
		headers() { 
			if (isMobile()) {
				return [
				{ text: 'שם לקוח', value: 'fullName', align:'end', class: 'primary white--text', width: '50%' },
				{ text: 'טלפונים', value: 'allPhones' , align:'start', class: 'primary white--text', width: '50%'},
				];
			} else {
				return [
				{ text: 'שם לקוח', value: 'fullName', align:'end', class: 'primary white--text', width: '20%' },
				{ text: 'כתובת', value: 'address' ,align:'end', class: 'primary white--text', width: '20%'},
				{ text: 'טלפונים', value: 'allPhones' , align:'end', class: 'primary white--text', width: '60%'},
				];				
			}
		},
		filteredCustomers() {
			return this.customers.filter(customer => {
				const matchesName = this.fullName ? (customer.fullName + '').includes(this.fullName) : true;
				const matchesPhone = this.phone ? (customer.allPhones + '').includes(this.phone) : true;
				return matchesName && matchesPhone;
			});
		}
	},	

	methods: {
		async getCustomers() {
			this.loading = true
			try {
				const response = await apiService.clientGetEntities(CUSTOMER_MODEL);
				this.customers = (response.data || []).map((item) => ({
					...item,
					allPhones: [item.phone1, item.phone2, item.phone3].filter(Boolean).join(' / '),
				}));
			} catch (error) {
				console.log(error);
			} finally {
				this.loading = false
			}
		},

		async customerForm(item) {
			let newCustomer = item ? false : true;
			await this.$refs.customerForm.open(item, newCustomer);
			this.getCustomers();
		},

		async customerTicketsList(item) {
			this.loading = true;
			let tickets = await apiService.clientGetEntities(TICKET_MODEL, {filter:{customerId:item.customerId}})
			this.tickets = tickets.data
			if (item.hasTicket) {
				this.customerName = item.fullName
			} else {
				this.customerName = '';
			}
			if (this.tickets.length === 1) this.updateTicket(this.tickets[0])
			this.loading = false;
		},

		async updateTicket(item) {
			await this.$refs.ticketForm.open(item, false);
		}
	},

	mounted() {
		this.getCustomers();
	}
};
</script>

<style scoped>
.row {
	justify-content: space-around;
	cursor: pointer;
	direction: rtl;
	padding: 0%;
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
