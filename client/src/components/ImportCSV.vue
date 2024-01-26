<template>
	<div class="text-center">

		<v-container class="bg-surface-variant">
			<v-row no-gutters>
				<v-col v-for="item in imports" :key="item.type" cols="12" sm="4">
					<v-card class="ml-3">
						<v-card-title class="text-h5 primary">
							{{ item.title }}
						</v-card-title>
						<v-card-text> Year data will be overwritten </v-card-text>
						<v-file-input truncate-length="50" @change="setFile"></v-file-input>
						<v-divider></v-divider>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn :disabled = "!file" :loading="loading" text @click="submitFile(item.type)"> Submit </v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-container>

		<v-snackbar :v-model="message.length" :multi-line="true">
			{{ message }}
			<template v-slot:action="{ attrs }">
				<v-btn color="red" text v-bind="attrs" @click="message = ''">
				Close
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script>
import SpecificServiceEndPoints from "../services/specificServiceEndPoints";

export default {
	data() {
		return {
			file: null,
			message: "this is snackbar message",
			imports: [{
				type: 'ticket',
				title: 'Import Tickets',
			},{
				type: 'customer',
				title: 'Import Customers',
			},{
				type: 'table',
				title: 'Import Tables',
			},{
				type: 'defects',	
				title: 'Import Defects'
			},{
				type: 'phones',	
				title: 'Import Phones'
			},{
				type: 'fixTime',	
				title: 'Import Fix Time'			}],
			loading: false,
		};
	},
	methods: {
		setFile(file) {
			if (file.type === "text/csv" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
				this.file = file; 
			else
				alert("file type MUST be csv or excel")
		},
		async submitFile(type) {
			this.loading = true;
			try {
				let response = '';
				switch (type){
					case "customer" :
						response = await SpecificServiceEndPoints.saveCustomersImport(this.file)
						break
					case "ticket" :
						response = await SpecificServiceEndPoints.saveTicketsImport(this.file)
						break
					case "table" :
						response = await SpecificServiceEndPoints.saveTablesImport(this.file)
						break
					case "defects" :
						response = await SpecificServiceEndPoints.saveDefectsImport(this.file)
						break
					case "phones" :
						response = await SpecificServiceEndPoints.savePhonesImport(this.file)
						break
					case "fixTime" :
						response = await SpecificServiceEndPoints.saveFixTimeImport(this.file)
						break
				}

				if (response.data && response.data.success) {
					this.message = response.data.message;
					alert(response.data.message);
					this.file = null;
					setTimeout(() => {
						this.message = '';
					}, 2500);
				}
			} catch (error) {
				console.log(error);
				this.message = "Something went wrong! Please try again later!";
			}
			this.loading = false;
		},
	},
};
</script>

<style scoped>
	.ml-3{
		margin: 5px;
	}
</style>