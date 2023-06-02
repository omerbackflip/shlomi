<template>
	<div class="list row no-print">
		<v-layout class="mt-1" row wrap>
			<v-card class="p-3 m-3">
				<v-data-table
					:headers="headers"
					disable-pagination
					hide-default-footer
					fixed-header
					height="75vh"
					:items="tickets"
					:single-expand="true"
					mobile-breakpoint="0"
					:search = "search"
					:loading = "loading"
					loader-height = "30"
					dense
					@click:row="updateTicket"
				>
					<template v-slot:top>
						<v-toolbar flat>
							<!-- <v-toolbar-title>{{ticketsFilter}} Tickets - {{tickets.length}}</v-toolbar-title> -->
							<v-toolbar-title>{{header}} - {{tickets.length}}</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" class="mx-4"	label="Search" clearable></v-text-field>
							<v-spacer></v-spacer>
							<v-btn @click="updateTicket()" small class="mt-3 mr-2">
								<v-icon class="nav-icon" small >mdi-plus</v-icon>
								New Ticket
							</v-btn>
						</v-toolbar>
					</template>
					<template v-slot:[`item.entryDate`]="{ item }">
						<span>{{ item.entryDate ? new Date(item.entryDate).toLocaleDateString('sv-SE') : '-'}}</span>
					</template>
					<template v-slot:[`item.fixDate`]="{ item }">
						<span>{{ item.fixDate ? new Date(item.fixDate).toLocaleDateString('sv-SE') : '-'}}</span>
					</template>
					<template v-slot:[`item.exitDate`]="{ item }">
						<span>{{ item.exitDate ? new Date(item.exitDate).toLocaleDateString('sv-SE') : '-'}}</span>
					</template>					
					<template v-slot:[`item.total`]="{ item }">
						<span>{{ item.total ? item.total.toLocaleString() : '' }}</span>
					</template>	
					<template v-slot:[`item.remarks`]="{ item }">
						<div style="direction: rtl;"> {{ item.remarks }} </div>
					</template>	
					<template v-slot:[`item.controls`]="{ item }">
						<td @click.stop>
							<v-btn @click="deleteTicket(item._id)" x-small>
								<v-icon small>mdi-delete</v-icon>
							</v-btn>
						</td>
					</template>
				</v-data-table>
			</v-card>
		</v-layout>
		<ticket-form @openPrint="handlePrint" ref="ticketForm"/>
		<confirm-dialog ref="confirm"/>
		<div>
            <PrintExitVue :customerInfo="customerInfo" :ticket="printData" ref="printExitVue"/>
        </div>
		<div>
            <PrintEntryVue :customerInfo="customerInfo" :ticket="printData" ref="printEntryVue"/>
        </div>
	</div>
</template>



<script>
import { TICKET_HEADERS, TICKET_MODEL } from "../constants/constants";
import apiService from "../services/apiService";
import TicketForm from './TicketForm.vue';
import ConfirmDialog from './Common/ConfirmDialog.vue';
import PrintExitVue from './PrintExit.vue';
import PrintEntryVue from './PrintEntry.vue';

export default {
	name: "ticket-list",
	components: { TicketForm, ConfirmDialog, PrintExitVue, PrintEntryVue },
	data() {
		return {
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
						this.header = "Total for year " + this.ticketsFilter 
						break;
					case 'CUSTOMER':
						response = await apiService.getMany({model: TICKET_MODEL, customerId: this.ticketsFilter });
						this.header = "Total for Customer ID " + this.ticketsFilter 
						break;
					case 'STATUS':
						response = await apiService.getMany({model: TICKET_MODEL, ticketStatus: this.ticketsFilter });
						this.header = "Total for Status " + this.ticketsFilter 
						break;
					default:
						console.log("switch filter is WRONG !!")
				}
				
				if(response.data) {
					this.tickets = response.data;
				}
			} catch (error) {
				console.log(error);
			}
			this.loading = false
		},
		handlePrint(data) {
			this.printData = data.ticket;
			this.customerInfo = data.customerInfo;
			data.printExit ? this.$refs.printExitVue.print(data) : this.$refs.printEntryVue.print(data);
		},
		async updateTicket(item) {
			let newTicket = item ? false : true;
			await this.$refs.ticketForm.open(item, newTicket);
			this.getTickets();
		},

		async deleteTicket(id) {
			try {
				if(id) {
					if(await this.$refs.confirm.open( "Confirm", "Are you sure to delete this ticket?")){
						let params = {model:TICKET_MODEL, id:id}
						await apiService.deleteOne(params)
						this.getTickets();
					}
				}
			} catch (error) {
				console.log(error);		
			}
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

</style>
