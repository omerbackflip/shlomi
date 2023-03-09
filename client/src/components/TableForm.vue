<template>
    <v-dialog
        v-model="dialog"
        width="500"
        :style="{ zIndex: options.zIndex }"
        @keydown.esc="cancel"
    >
        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                {{!table ? 'New' : 'Update'}} Table
            </v-card-title>
            <div class="field-margin" v-show="showMessage">
                {{message}}
            </div>

                   <v-row class="p-3 overflow-hidden">
                        <v-col cols="4" sm="6" md="4">
                            <v-text-field v-model="table.table_id" label="ID"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="table.table_code" label="Code"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-text-field v-model="table.description" label="Description"></v-text-field>
                        </v-col>          
                    </v-row>


            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> Close </v-btn>
                <v-btn :disabled = "!table.table_id" color="primary" text @click="submitTable()"> Submit </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { TABLE_MODEL } from "../constants/constants";
import apiService from "../services/apiService";

export default {
    name: "table-form",
    data() {
        return {
            table: {},
			dialog: false,
            resolve: null,  
			showMessage: false,
            newTable: false,
			message: '',
            options: {
                color: "grey lighten-3",
                width: 500,
                zIndex: 200,
            },
        };
    },
    methods: {
        async submitTable() {
			try {
				let response;
				if(this.newTable) {
					response = await apiService.create({...this.table} , {model:TABLE_MODEL});
				} else {
					response = await apiService.update(this.table._id , { ...this.table } , {model:TABLE_MODEL});
				}

                if(response.data && response.data.data) {
					this.message = 'Table successfully created/updated!';
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
        open(table, newTable) {
            this.newTable = newTable;
            this.table = newTable ? {} : {...table};
            this.dialog = true;
            return new Promise((resolve) => {
                this.resolve = resolve;
            });
        },
    },
};
</script>

<style scoped>
.overflow-hidden{
    overflow: hidden;
}
</style>