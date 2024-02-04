import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;
class SpecificServiceEndPoints {

	async saveCustomersImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-customers`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async saveTicketsImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-tickets`, formData ,{ 
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

	async saveTablesImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-tables`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	async saveDefectsImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-defects`, formData, {
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

	async saveFixTimeImport(file) {
		var formData = new FormData();
		formData.append("file", file);
		return await axios.post(`${baseUrl}/specific/save-fixTime`, formData, {
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

	async getNoClose() {
		return await axios.get(`${baseUrl}/specific/get-no-close`);
	}

}

export default new SpecificServiceEndPoints();