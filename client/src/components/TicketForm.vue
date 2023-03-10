<template>
    <v-dialog
        v-model="dialog"
        width="500"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="cancel"
    >
        <v-card class="overflow-hidden">
            <v-card-title class="text-h5 grey lighten-2">
                {{!(ticket.ticketId) ? 'New' : 'Update'}} Ticket
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>

                   <v-row class="p-4">
                        <v-col cols="4">
                            <v-text-field type="number" v-model="ticket.customerId" label="Customer ID"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field type="number" v-model="ticket.itemCode" label="Item code"></v-text-field>
                        </v-col>          
                        <v-col cols="4">
                            <v-dialog ref="dialog" v-model="dateModal" :return-value.sync="ticket.entryDate" persistent width="290px">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field 
                                    v-model="ticket.entryDate"
                                    label="Entry date"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on" >
                                    </v-text-field>
                                </template> 
                                <v-date-picker v-model="ticket.entryDate" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="dateModal = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.dialog.save(ticket.entryDate)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="ticket.item" label="Item"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="ticket.defectDescription" label="Defect description"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field type="number" v-model="ticket.checkPrice" label="Check price"></v-text-field>
                        </v-col>
                        <v-col cols="4"> 
                            <v-text-field type="number" v-model="ticket.prepaid" label="Pre-paid"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field type="number" v-model="ticket.discountPrice" label="Discount price"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="ticket.remarks" label="Remark"></v-text-field>
                        </v-col>                           
                    </v-row>


            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> Cancel</v-btn>
                <v-btn color="success" text @click="dialog = false"> Close Ticket</v-btn>
                <v-btn :disabled = "!ticket.customerId" color="primary" text @click="submitTicket()"> Submit </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { TICKET_MODEL } from "../constants/constants";
import apiService from "../services/apiService";

export default {
    name: "ticket-form",
    data() {
        return {
            ticket: {},
			dialog: false,
            dateModal : false,
            resolve: null,  
			showMessage: false,
            newTicket: false,
			message: '',
            options: {
                color: "grey lighten-3",
                width: 500,
                zIndex: 200,
            },
        };
    },
    methods: {
        async submitTicket() {
			try {
				let response;
				if(this.newTicket) {
                    let lastTicket = await apiService.get({model: TICKET_MODEL , sort: {ticketId: -1 } , limit: 1});
                    const { ticketId } = lastTicket.data[0];
                    response = await apiService.create({...this.ticket, ticketId: ticketId+1} , {model:TICKET_MODEL});
				} else {
					response = await apiService.update(this.ticket._id , { ...this.ticket } , {model:TICKET_MODEL});
				}

                if(response.data && response.data.data) {
					this.message = 'Ticket successfully created/updated!';
				}
                this.showMessage = true;
                setTimeout(() => {
                    this.dialog = false;
                    this.showMessage = false;
                    this.resolve(true);
                }, 2000);

			} catch (error) {
				console.log(error);
			}
		},
        async open(ticket, newTicket) {
            this.newTicket = newTicket;
            this.ticket = newTicket ? {} : {...ticket};
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },
    },
};
</script>

<style scoped>
    .p-4{
        padding: 15px
    }
    .overflow-hidden{
        overflow: hidden;
    }
</style>