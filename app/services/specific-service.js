const moment = require('moment');

// Field mapping configuration for each data type
const FIELD_MAPPING = {
	customers: {
		fields: [
			'customerId', 'fullName', 'address', 'city', 'phone1', 'phone2', 'phone3',
			'arrivedFrom', 'issueDate', 'hasTicket', 'ticketExist', 'remark'
		],
		arrayFields: [], // specifies which fields should be arrays
		filter: null // no filter needed
	},
	tickets: {
		fields: [
			'ticketId', 'ticketStatus', 'customerId', 'customerName', 'item', 
			'entryCondition', 'accessories', 'defectDescription', 'defectFound', 'defectFixes',
			'prepaid', 'prepaidInvoice', 'amount', 'vat', 'total', 'invoice', 'year',
			'entryDate', 'fixDate', 'exitDate', 'remarks', 'ticketRemark', 'fixHour', 'fixMin', 'partsCost'
		],
		arrayFields: ['entryCondition', 'accessories', 'defectDescription', 'defectFound', 'defectFixes','remarks', 'ticketRemark'], // fields that should be converted to arrays during import
		filter: (item) => item['ticketId'] // filter out items without ticketId
	},
	invoices: {
		fields: ['supplierId', 'invoiceId', 'date', 'amount', 'paymentId', 'remark'],
		arrayFields: [], // specifies which fields should be arrays
		filter: null
	},
    payments: {
		fields: ['supplierId', 'paymentId', 'checkId', 'date', 'amount', 'remark'],
		arrayFields: [], // specifies which fields should be arrays
		filter: null
	},
	tables: {
		fields: ['table_id', 'table_code', 'description', 'numeric'],
		arrayFields: [], // specifies which fields should be arrays
		filter: null
	},    
	phones: {
		fields: ['fullName', 'address', 'phone1', 'phone2', 'phone3', 'phone4', 'phoneType', 'remark'],
		arrayFields: [], // specifies which fields should be arrays
		filter: null
	}
};

// Generic function to transform data (for export - joins arrays with commas)
const transformData = (data, config) => {
	try {
		let result = [];
		data.forEach(item => {
			// Apply filter if exists
			if (config.filter && !config.filter(item)) return;

			let obj = {};
			config.fields.forEach(field => {
				// Check if there's a field mapping (for different source/target names)
				const sourceField = config.sourceFieldMap ? config.sourceFieldMap[field] : field;
				// Handle array fields by joining with commas for CSV export
				const value = item[sourceField];
				obj[field] = Array.isArray(value) ? value.join(',') : value;
			});

			result.push(obj);
		});

		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Transform data for import (converts comma-separated strings back to arrays)
const transformDataForImport = (data, config) => {
	try {
		let result = [];
		data.forEach(item => {
			// Apply filter if exists
			if (config.filter && !config.filter(item)) return;

			let obj = {};
			config.fields.forEach(field => {
				// Check if there's a field mapping (for different source/target names)
				const sourceField = config.sourceFieldMap ? config.sourceFieldMap[field] : field;
				let value = item[sourceField];

				// If this field is defined as an array field and value is a string with commas, split it
				if (config.arrayFields && config.arrayFields.includes(field) && typeof value === 'string' && value.trim()) {
					value = value.split(',').map(v => v.trim()).filter(v => v); // split by comma and trim each element
				}

				obj[field] = value;
			});

			result.push(obj);
		});

		return result;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Public exports - using the generic transformData function
exports.getCustomersToImport = (data) => transformDataForImport(data, FIELD_MAPPING.customers);

exports.getTicketsToImport = (data) => transformDataForImport(data, FIELD_MAPPING.tickets);

exports.getInvoicesToImport = (data) => transformDataForImport(data, FIELD_MAPPING.invoices);

exports.getPaymentsToImport = (data) => transformDataForImport(data, FIELD_MAPPING.payments);

exports.getTablesToImport = (data) => transformDataForImport(data, FIELD_MAPPING.tables);

exports.getPhonesToImport = (data) => transformDataForImport(data, FIELD_MAPPING.phones);