<template>
	<div class="row no-print">
		<v-layout class="mt-1" row wrap>
			<v-data-table
				:headers="headers"
				disable-pagination
				hide-default-footer
				fixed-header
				height="78vh"
				:items="tickets"
				:single-expand="true"
				mobile-breakpoint="0"
				:search = "search"
				:loading = "loading"
				loader-height = "30"
				dense
				class="elevation-3 hebrew"
				@click:row="updateTicket"
			>
				<template v-slot:top>
					<v-toolbar flat>
						<!-- <v-toolbar-title>{{ticketsFilter}} Tickets - {{tickets.length}}</v-toolbar-title> -->
						<v-toolbar-title>{{header}} - {{tickets.length}}</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" class="mx-4"	label="Search" clearable></v-text-field>
						<v-spacer></v-spacer>
						<v-btn @click="updateTicket()" small class="mt-3 m-2">
							<v-icon class="nav-icon" small >mdi-plus</v-icon>
							<div v-if="!isMobile()"> כרטיס חדש </div>
						</v-btn>
						<export-excel :fetch="fetchData" type="xlsx" name="tickets">
							<v-btn small class="btn btn-danger mt-1" :loading="loading">
								<v-icon >mdi-download</v-icon>
							</v-btn>
						</export-excel>
					</v-toolbar>
				</template>
				<template v-slot:[`item.entryDate`]="{ item }">
					<span>{{ item.entryDate ? new Date(item.entryDate).toLocaleDateString('en-GB') : '-'}}</span>
				</template>
				<template v-slot:[`item.customerName`]="{ item }">
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<div v-on="on" :class="{custRmk: item.customerRemark}">{{ item.customerName }}</div>
						</template>
						<span>{{item.customerRemark}}</span>
					</v-tooltip>
				</template>
			</v-data-table>
		</v-layout>
		<ticket-form ref="ticketForm"/>
		<confirm-dialog ref="confirm"/>
	</div>
</template>



<script>
import { TICKET_HEADERS, TICKET_MODEL, isMobile, CUSTOMER_MODEL } from "../constants/constants";
import apiService from "../services/apiService";
import TicketForm from './TicketForm.vue';
import ConfirmDialog from './Common/ConfirmDialog.vue';
import excel from "vue-excel-export";
import Vue from "vue";
import specificServiceEndPoints from '../services/specificServiceEndPoints';
Vue.use(excel);
export default {
	name: "ticket-list",
	components: { TicketForm, ConfirmDialog },
	data() {
		return {
			isMobile,
			tickets: [],
			showMessage: false,
			header: '',
			headers: TICKET_HEADERS,
			customerInfo: null,
			listOfItems: [],
			search: '',
			printData: null,
			ticketsFilter: 'Open',
			ticketType: 'STATUS',
			loading: '',
			////////////////////////////////////
			// json_fields: {
			//     'Name': 'name',
			//     'City': 'city',
			// 	'Country': 'country',
			//     'phone' : {
			//         field: 'phone',
			//         callback: (value) => {
			//             return `${value}`;
			//         }
			//     },
			// },
			// json_data: [
			//     {
			//         'name': 'Tony Peña',
			//         'city': 'New York',
			//         'country': 'United States',
			//         'phone': ['STR1', 'STR2', 'STR3']
			//     },
			//     {
			//         'name': 'Thessaloniki',
			//         'city': 'Athens',
			//         'country': 'Greece',
			//         'phone': ['STR4', 'STR6', 'STR5']
			//     }
			// ],
			////////////////////////////////////
		}
	},

	methods: {
		async getTickets() {
			this.loading = true;
			let response = '';
			try {
				switch (this.ticketType) {
					case 'YEAR':
						response = await apiService.getMany({model: TICKET_MODEL, year: this.ticketsFilter });
						this.header = "סה'כ לשנה " + this.ticketsFilter 
						break;
					case 'CUSTOMER':
						response = await apiService.getMany({model: TICKET_MODEL, customerId: this.ticketsFilter });
						this.header = "סה'כ ללקוח " + this.ticketsFilter 
						break;
					case 'STATUS':
						if (this.ticketsFilter != 'ALL') {
							response = await apiService.getMany({model: TICKET_MODEL, ticketStatus: this.ticketsFilter });
						} else response = await specificServiceEndPoints.getNoClose();
						this.header = this.ticketsFilter 
						break;
					default:
						console.log("switch filter is WRONG !!")
				}
				
				if(response.data) {
					this.tickets = response.data;
					let customer = '';
					this.tickets = await Promise.all(response.data.map(async(item) =>{
						customer = await apiService.getOne({model: CUSTOMER_MODEL, customerId: item.customerId})
						return ({...item , customerRemark: customer.data.remark })
					}))
				}
			} catch (error) {
				console.log(error);
			}
			this.loading = false
		},

		async updateTicket(item) {
			let newTicket = item ? false : true;
			await this.$refs.ticketForm.open(item, newTicket);
			this.getTickets();
		},

		// async deleteTicket(id) {
		// 	try {
		// 		if(id) {
		// 			if(await this.$refs.confirm.open( "Confirm", "Are you sure to delete this ticket?")){
		// 				let params = {model:TICKET_MODEL, id:id}
		// 				await apiService.deleteOne(params)
		// 				this.getTickets();
		// 			}
		// 		}
		// 	} catch (error) {
		// 		console.log(error);		
		// 	}
		// },

		async fetchData(){
            this.loading = true;
            const response = await apiService.getMany({model:TICKET_MODEL})
            this.loading = false;
            return response.data;
        },
	},

	mounted() {
		if (this.$route.params.ticketType) { // this is called from CustomerList.vue
				this.ticketType = this.$route.params.ticketType
				this.ticketsFilter = this.$route.params.ticketsFilter
		}
		this.getTickets();
		this.$root.$on("filterChange", (filter, type) => {
			this.ticketType = type
			this.ticketsFilter = filter;
		});
	},

	watch: {
		ticketsFilter() {
			this.getTickets();
		},
	},
};
</script>

<style scoped>
.row {
	cursor: pointer;
}

.v-toolbar__title {
        white-space: pre-wrap !important;
        font-size: smaller !important;
    }


@media print {  /* Very important to remove background in print mode */
    .no-print {
        display: none;
    }
}
.hebrew {
  direction: rtl;
  /* text-align: right; */
  text-align-last: right !important
}
.custRmk{
	background-color: yellow;
}
</style>
