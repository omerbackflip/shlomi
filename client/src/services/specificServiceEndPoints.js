import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;
class SpecificServiceEndPoints {

	async saveCustomersNewImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-customers-new`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async saveTicketsNewImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-tickets-new`, formData ,{ 
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async saveInvoicesNewImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-invoices-new`, formData ,{ 
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}
	
	async savePaymentsNewImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-payments-new`, formData ,{ 
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async saveTablesNewImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-tables-new`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async savePhonesImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-phones`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async searchCustomers(params) {
		return await axios.get(`${baseUrl}/specific/search-customers`,{params});
	}

	async hasTicketsBulk() {
		return await axios.post(`${baseUrl}/specific/hasTickets-bulk`);
	}

	async getDbInfo() {
		return await axios.get(`${baseUrl}/specific/get-database-info`);
	}

	async sendMessageToUser(body) {
		return await axios.post(`${baseUrl}/specific/send-message`,body);
	}

	async getNoClose() {  // not used
		return await axios.get(`${baseUrl}/specific/get-no-close`);
	}

	async getWithRemark(params) {
		return await axios.get(`${baseUrl}/specific/get-with-remark`,{params});
	}

	async getTabels() {
		return await axios.get(`${baseUrl}/specific/get-tables`);
	}

	async createExcel() {
		return await axios.post(`${baseUrl}/specific/create-excel`);
	}
}

export default new SpecificServiceEndPoints();