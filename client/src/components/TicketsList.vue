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
				>
					<template v-slot:top>
						<v-toolbar flat>
							<v-toolbar-title>Total Tickets - {{tickets.length}}</v-toolbar-title>
							<v-text-field
								v-model="search"
								class="mx-4"
								label="Search"
							></v-text-field>
							<v-spacer></v-spacer>
							<v-btn @click="updateTicket()" small class="mt-3">
								<v-icon class="nav-icon" small >mdi-plus</v-icon>
								New Ticket
							</v-btn>
						</v-toolbar>
					</template>
					<template v-slot:expanded-item="{headers,item}">
						<td :colspan="headers.length">
							<ul class="expanded-datatable" :key="element._id" v-for="element in Object.keys(item)">
								{{toTitleCase(element)}} : {{item[element]}}
							</ul>
						</td>
					</template>
					<template v-slot:[`item.item`]="{ }">
						<v-select > 
							v-model="item.item"
							:items="listOfItems"
						</v-select>
					</template>					
					<template v-slot:[`item.entryDate`]="{ item }">
						<span>{{ new Date(item.entryDate).toLocaleDateString('he-EG') }}</span>
					</template>
					<template v-slot:[`item.fixDate`]="{ item }">
						<span>{{ new Date(item.fixDate).toLocaleDateString('he-EG') }}</span>
					</template>
					<template v-slot:[`item.controls`]="{ item }">
						<v-btn @click="updateTicket(item)" x-small>
							<v-icon small>mdi-pencil</v-icon>
						</v-btn>
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
import { ALL_TICKET_HEADERS, TICKET_HEADERS, TICKET_MODEL, TABLE_MODEL } from "../constants/constants";
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
		}
	},

	methods: {
		async getTickets() {
			try {
				const response = await apiService.get({model: TICKET_MODEL, limit:500});
				if(response.data && response.data) {
					this.tickets = response.data;
				}
			} catch (error) {
				console.log(error);
			}
		},

		async getItemList () {
			try {
				const response = await apiService.get({model: TABLE_MODEL, table_id : 1});
				if(response.data && response.data) {
					this.listOfItems = response.data.map ((item) => {
						return (item.description)
					});
				}
			} catch (error) {
				console.log(error);
			}
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

		toTitleCase(text) {
			const result = text.replace(/([A-Z])/g, " $1");
			return result.charAt(0).toUpperCase() + result.slice(1);
		}

	},

	mounted() {
		this.getTickets();
		this.getItemList();
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

</style>
