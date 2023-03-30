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


	async searchCustomers(params) {
		return await axios.get(`${baseUrl}/specific/search-customers`,{params});
	}
}

export default new SpecificServiceEndPoints();