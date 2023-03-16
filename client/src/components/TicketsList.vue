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
					:items="tickets"
					:expanded.sync="expanded"
					item-key="ticketId"
					show-expand
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
							<v-toolbar-title>{{selectedFilter}} Tickets - {{tickets.length}}</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-text-field v-model="search" class="mx-4"	label="Search" clearable></v-text-field>
							<v-spacer></v-spacer>
							<v-btn @click="updateTicket()" small class="mt-3 mr-2">
								<v-icon class="nav-icon" small >mdi-plus</v-icon>
								New Ticket
							</v-btn>
							<v-btn @click="margeCustomerName()" small class="mt-3">Merge</v-btn>
						</v-toolbar>
					</template>
					<!-- <template v-slot:expanded-item="{headers,item}">
						<td :colspan="headers.length">
							<ul class="expanded-datatable" :key="element._id" v-for="element in Object.keys(item)">
								{{toTitleCase(element)}} : {{item[element]}}
							</ul>
						</td>
					</template> -->
					<template v-slot:[`item.entryDate`]="{ item }">
						<span>{{ new Date(item.entryDate).toLocaleDateString('sv-SE') }}</span>
					</template>
					<template v-slot:[`item.fixDate`]="{ item }">
						<span>{{ new Date(item.fixDate).getFullYear() != 1970 ? new Date(item.fixDate).toLocaleDateString('he-EG') : '-'}}</span>
					</template>
					<template v-slot:[`item.exitDate`]="{ item }">
						<span>{{ new Date(item.exitDate).getFullYear() != 1970 ? new Date(item.exitDate).toLocaleDateString('he-EG') : '-'}}</span>
					</template>					
					<template v-slot:[`item.controls`]="{ item }">
						<!-- <v-btn @click="updateTicket(item)" x-small>
							<v-icon small>mdi-pencil</v-icon>
						</v-btn> -->
						<v-btn @click="deleteTicket(item._id)" x-small>
							<v-icon small>mdi-delete</v-icon>
						</v-btn>
					</template>
				</v-data-table>
			</v-card>
		</v-layout>
		<ticket-form ref="ticketForm"/>
		<confirm-dialog ref="confirm"/>
	</div>
</template>



<script>
import { ALL_TICKET_HEADERS, TICKET_HEADERS, TICKET_MODEL, TABLE_MODEL, CUSTOMER_MODEL } from "../constants/constants";
import apiService from "../services/apiService";
import TicketForm from './TicketForm.vue';
import ConfirmDialog from './Common/ConfirmDialog.vue';

export default {
	name: "tickets-list",
	components: { TicketForm, ConfirmDialog },
	data() {
		return {
			tickets: [],
			expanded: [],
			showMessage: false,
			message: '',
			headers: TICKET_HEADERS,
			allTicketHeaders: ALL_TICKET_HEADERS,
			listOfItems: [],
			search: '',
			selectedFilter: 'Open',
			loading: '',
		}
	},

	methods: {
		async getTickets() {
			this.loading = true
			try {
				const response = await apiService.getMany({model: TICKET_MODEL, ticketStatus: this.selectedFilter });
				if(response.data) {
					this.tickets = response.data;
				}
			} catch (error) {
				console.log(error);
			}
			this.loading = false
		},

		async getItemList () {
			try {
				const response = await apiService.getMany({model: TABLE_MODEL, table_id : 1});
				if(response.data) {
					this.listOfItems = response.data.map ((item) => {
						return (item.description)
					});
				}
			} catch (error) {
				console.log(error);
			}
		},

		margeCustomerName () {
			try {
				this.tickets.map (async (item) =>  {
					// const response = await apiService.getMany({model: CUSTOMER_MODEL, customerId : item.customerId});
					const response = await apiService.getOne({model: CUSTOMER_MODEL, customerId : item.customerId});
					if(response.data) {
						item.customerName = response.data.name + ' ' + response.data.family;
					}
				})
				this.tickets.map (async (item) =>  {
					await apiService.update(item._id, {...item},{model: TICKET_MODEL});
				})
			} catch (error) {
				console.log(error);
			}
		},

		async updateTicket(item) {
			let newTicket = item ? false : true;
			await this.$refs.ticketForm.open(item, newTicket);
			this.getTickets();
		},
		async onItemSelect(value,data) {
			await apiService.update( data._id, {...data , item: value}, {model: TICKET_MODEL});
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
		toTitleCase(text) {
			const result = text.replace(/([A-Z])/g, " $1");
			return result.charAt(0).toUpperCase() + result.slice(1);
		}

	},

	mounted() {
		this.getTickets();
		this.getItemList();
		this.$root.$on("filterChange", (filter) => {
			this.selectedFilter = filter;
		});
	},

	watch: {
		selectedFilter() {
			this.getTickets();
		},
	},
};
</script>

<style>


.field-margin{
	margin: 12px;
}

.expanded-datatable{
	width: 50%;
    margin: 15px;
    border: 1px solid #bd7244;
	cursor: pointer;
}

.v-data-table__expanded{
	text-align: -webkit-center;
}

.row {
	cursor: pointer;
}

</style>
