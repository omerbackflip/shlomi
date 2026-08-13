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
	},
	priceListParts: {
		fields: ['itemCode', 'partId', 'description', 'customerPrice', 'labPrice', 'companyPrice', 'remark'],
		sourceFieldMap: {
			itemCode: 'ItemCode',
			labPrice: 'LabPrice',
			remark: 'Remark'
		},
		arrayFields: [],
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
				const sourceField = config.sourceFieldMap && config.sourceFieldMap[field]
					? config.sourceFieldMap[field]
					: field;
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
				const sourceField = config.sourceFieldMap && config.sourceFieldMap[field]
					? config.sourceFieldMap[field]
					: field;
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

exports.getPriceListPartsToImport = (data) => {
	const mappedItems = transformDataForImport(data, FIELD_MAPPING.priceListParts);
	const errors = [];
	const compoundKeys = new Set();

	const items = mappedItems.map((item, index) => {
		const rowNumber = index + 2;
		const itemCode = toRequiredNumber(item.itemCode);
		const partId = toRequiredNumber(item.partId);
		const customerPrice = toRequiredNumber(item.customerPrice);
		const labPrice = toRequiredNumber(item.labPrice);
		const companyPrice = toRequiredNumber(item.companyPrice);
		const description = typeof item.description === 'string' ? item.description.trim() : '';

		if (!Number.isInteger(itemCode)) errors.push(`Row ${rowNumber}: ItemCode must be an integer`);
		if (!Number.isInteger(partId)) errors.push(`Row ${rowNumber}: partId must be an integer`);
		if (!description) errors.push(`Row ${rowNumber}: description is required`);
		if (!Number.isFinite(customerPrice) || customerPrice < 0) {
			errors.push(`Row ${rowNumber}: customerPrice must be a non-negative number`);
		}
		if (!Number.isFinite(labPrice) || labPrice < 0) {
			errors.push(`Row ${rowNumber}: labPrice must be a non-negative number`);
		}
		if (!Number.isFinite(companyPrice) || companyPrice < 0) {
			errors.push(`Row ${rowNumber}: companyPrice must be a non-negative number`);
		}

		if (Number.isInteger(itemCode) && Number.isInteger(partId)) {
			const compoundKey = `${itemCode}:${partId}`;
			if (compoundKeys.has(compoundKey)) {
				errors.push(`Row ${rowNumber}: duplicate ItemCode/partId combination ${compoundKey}`);
			}
			compoundKeys.add(compoundKey);
		}

		return {
			itemCode,
			partId,
			description,
			customerPrice,
			labPrice,
			companyPrice,
			remark: item.remark == null ? '' : String(item.remark).trim()
		};
	});

	if (errors.length) {
		const error = new Error(`Price list validation failed: ${errors.slice(0, 20).join('; ')}`);
		error.statusCode = 400;
		error.validationErrors = errors;
		throw error;
	}

	return items;
};

function toRequiredNumber(value) {
	if (value === null || value === undefined || value === '') return NaN;
	return Number(value);
}
