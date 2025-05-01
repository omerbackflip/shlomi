<template>
	<div class="row no-print">
		<v-layout class="mt-1" row wrap>
			<v-data-table
				:headers="getHeaders()"
				:items="tickets"
				disable-pagination
				hide-default-footer
				fixed-header
				height="78vh"
				:single-expand="true"
				mobile-breakpoint="0"
				:search = "search"
				:loading = "loading"
				loader-height = "30"
				dense
				class="hebrew p-0"
				@click:row="updateTicket"
			>
				<template v-slot:top>
					<v-toolbar flat>
						<v-toolbar-title style="text-align-last: center;">{{header}} - {{tickets.length}}</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" class="mx-4"	label="Search" clearable hide-details></v-text-field>
						<v-spacer></v-spacer>
						<v-btn @click="updateTicket()" small class="mt-3 m-2">
							<v-icon class="nav-icon" small >mdi-plus</v-icon>
							<div v-if="!isMobile()"> כרטיס חדש </div>
						</v-btn>
						<export-excel v-if="!isMobile()" :fetch="fetchData" type="xlsx" name="tickets">
							<v-btn small class="btn btn-danger mt-1" :loading="loading">
								<v-icon>mdi-download</v-icon>
							</v-btn>
						</export-excel>
					</v-toolbar>
				</template>
				<template v-slot:[`item.entryDate`]="{ item }">
					<span>{{ item.entryDate ? new Date(item.entryDate).toLocaleDateString('en-GB') : '-'}}</span>
				</template>
				<template v-slot:[`item.customerName`]="{ item }">
					<td style="font-size: large;">
						{{ item.customerName }}
						<span v-show="item.customerRemark && !isMobile()" class="custRmk">{{item.customerRemark}}</span>
						<span v-show="isMobile()" style="font-size:medium; display: block;">{{ new Date(item.entryDate).toLocaleDateString('en-GB') }}</span>
					</td>
				</template>
				<template v-slot:[`item.item`]="{ item }">
					<tr :class="`${item.ticketStatus}`">
						<span><b>{{ item.item }}</b></span>
					</tr>
					<td v-show="isMobile()">{{ item.defectDescription[0] }}</td>
				</template>
				<template v-slot:[`item.ticketRemark`]="{ item }">
					<td :class="{'yellow lighten-3': item.ticketRemark[0] && !item.ticketRemark[0].includes('מאשר')}">
						{{ item.ticketRemark[0] }}
					</td>
				</template>
			</v-data-table>
		</v-layout>
		<ticket-form ref="ticketForm"/>
		<confirm-dialog ref="confirm"/>
	</div>
</template>



<script>
import { TICKET_HEADERS, TICKET_MOBILE_HEADERS, TICKET_MODEL, isMobile } from "../constants/constants";
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
			// headers: getHeaders(),
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
						// response = await apiService.getMany({model: TICKET_MODEL, year: this.ticketsFilter });
						response = await specificServiceEndPoints.getWithRemark({year: this.ticketsFilter});
						this.header = "סה'כ לשנה " + this.ticketsFilter 
						break;
					case 'CUSTOMER':
						// response = await apiService.getMany({model: TICKET_MODEL, customerId: this.ticketsFilter });
						response = await specificServiceEndPoints.getWithRemark({customerId: this.ticketsFilter});
						this.header = "סה'כ ללקוח " + this.ticketsFilter 
						break;
					case 'STATUS':
						response = await specificServiceEndPoints.getWithRemark({ticketStatus: this.ticketsFilter});
						this.header = this.ticketsFilter 
						break;
					default:
						console.log("switch filter is WRONG !!")
				}
				
				if(response.data) {
					this.tickets = response.data;
					this.tickets = this.tickets.sort((a,b) => {return (a.ticketId - b.ticketId)})
					// let customer = '';
					// this.tickets = await Promise.all(response.data.map(async(item) =>{
					// 	customer = await apiService.getOne({model: CUSTOMER_MODEL, customerId: item.customerId})
					// 	return ({...item , customerRemark: customer.data.remark })
					// }))
				}
			} catch (error) {
				console.log(error);
			}
			this.loading = false
		},

		getHeaders() {
			if (this.isMobile()) {
				return TICKET_MOBILE_HEADERS;
			} else {
				return TICKET_HEADERS;
			}
		},

		async updateTicket(item) {
			let newTicket = item ? false : true;
			await this.$refs.ticketForm.open(item, newTicket);
			this.getTickets();
		},

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
	padding: 0%;
	justify-content: center;
}

.v-toolbar__title {
	white-space: pre-wrap !important;
}

.v-toolbar__content {
	padding-right: 15px;
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
	color: red;
	/* font-size: large; */
	display: grid;
}

/* td {
	font-size: larger !important;
} */

.Open {
	border-right-width: thick;
    border-color: red;
}

.Fixed {
	border-right-width: thick;
    border-color: lightgreen;
}
.Checked {
	border-right-width: thick;
    border-color:yellow
}
</style>
