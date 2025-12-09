const moment = require('moment');

// Field mapping configuration for each data type
const FIELD_MAPPING = {
	customers: {
		fields: [
			'customerId', 'fullName', 'address', 'city', 'phone1', 'phone2', 'phone3',
			'arrivedFrom', 'issueDate', 'hasTicket', 'ticketExist', 'remark'
		],
		filter: null // no filter needed
	},
	tickets: {
		fields: [
			'ticketId', 'ticketStatus', 'customerId', 'customerName', 'item', 
			'entryCondition', 'accessories', 'defectDescription', 'defectFound', 'defectFixes',
			'prepaid', 'prepaidInvoice', 'amount', 'vat', 'total', 'invoice', 'year',
			'entryDate', 'fixDate', 'exitDate', 'remarks', 'ticketRemark', 'fixHour', 'fixMin', 'partsCost'
		],
		filter: (item) => item['ticketId'] // filter out items without ticketId
	},
	invoices: {
		fields: ['supplierId', 'invoiceId', 'date', 'amount', 'paymentId', 'remark'],
		filter: null
	},
    payments: {
		fields: ['supplierId', 'paymentId', 'checkId', 'date', 'amount', 'remark'],
		filter: null
	},
	tables: {
		fields: ['table_id', 'table_code', 'description', 'numeric'],
		filter: null
	},    
	phones: {
		fields: ['fullName', 'address', 'phone1', 'phone2', 'phone3', 'phone4', 'phoneType', 'remark'],
		filter: null
	}
};

// Generic function to transform data
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
				obj[field] = item[sourceField];
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
exports.getCustomersNewToSave = (data) => transformData(data, FIELD_MAPPING.customers);

exports.getTicketsNewToSave = (data) => transformData(data, FIELD_MAPPING.tickets);

exports.getInvoicesNewToSave = (data) => transformData(data, FIELD_MAPPING.invoices);

exports.getPaymentsNewToSave = (data) => transformData(data, FIELD_MAPPING.payments);

exports.getTablesNewToSave = (data) => transformData(data, FIELD_MAPPING.tables);

exports.getPhonesToSave = (data) => transformData(data, FIELD_MAPPING.phones);