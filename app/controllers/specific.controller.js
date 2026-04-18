const db = require("../models");
const Customer = db.customers;
const Ticket = db.tickets;
const Invoice = db.invoices;
const Payment = db.payments;
const Table = db.tables;
const Phone = db.phones;
// const dbService = require("../services/db-service");
const dbService = require('../shared/mongoose/services/db-service');
const specificService = require("../services/specific-service");
const XLSX = require('xlsx');
const fs = require('fs');            // for existsSync / mkdirSync if used
const fsp = require('fs').promises;  // use fsp.unlink(...) with await
const { transformCSVData, createExcelUtil } = require("../util/util");
const { url } = require("../config/db.config");
const moment = require('moment');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
// const google = require('../../google/drive/upload');
const path = require('path');
const TMP_DIR = path.resolve(__dirname, '../../tmp'); // adjust if you prefer different tmp
const backupUtils = require('../util/backupUtils');
const googleSubmoduleService = require('../services/google-submodule-service');


// Configuration for bulk import operations
const BULK_IMPORT_CONFIG = {
	customers: {
		model: Customer,
		serviceMethod: 'getCustomersToImport',
		options: {}
	},
	tickets: {
		model: Ticket,
		serviceMethod: 'getTicketsToImport',
		options: { type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy;@' }
	},
	invoices: {
		model: Invoice,
		serviceMethod: 'getInvoicesToImport',
		options: { type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy;@' }
	},
	payments: {
		model: Payment,
		serviceMethod: 'getPaymentsToImport',
		options: { type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy;@' }
	},
	tables: {
		model: Table,
		serviceMethod: 'getTablesToImport',
		options: {}
	},
	phones: {
		model: Phone,
		serviceMethod: 'getPhonestoImport',
		options: {}
	}
};

exports.saveBulkData = async (req, res) => {
	try {
		const { dataType } = req.body;
		const config = BULK_IMPORT_CONFIG[dataType];

		if (!config) {
			return res.status(400).send({ success: false, message: 'Invalid data type' });
		}

		await config.model.deleteMany();
		const workbook = XLSX.readFile(`uploads/${req.file.filename}`, config.options);
		const sheetNameList = workbook.SheetNames;
		const data = transformCSVData(sheetNameList, workbook);

		const items = specificService[config.serviceMethod](data[0]);
		await dbService.insertMany(config.model, items);

		unLinkFile(`uploads/${req.file.filename}`);
		return res.send({
			success: true,
			message: `Total ${items.length} ${dataType} successfully Imported`
		});

	} catch (error) {
		console.log(error);
		res.status(500).send({ message: 'Error saving data', error });
	}
};

// Legacy endpoints - kept for backward compatibility
exports.saveCustomersNewBulk = async (req, res) => {
	req.body = { dataType: 'customers' };
	return exports.saveBulkData(req, res);
};

exports.saveTicketsNewBulk = async (req, res) => {
	req.body = { dataType: 'tickets' };
	return exports.saveBulkData(req, res);
};

exports.saveInvoicesNewBulk = async (req, res) => {
	req.body = { dataType: 'invoices' };
	return exports.saveBulkData(req, res);
};

exports.savePaymentsNewBulk = async (req, res) => {
	req.body = { dataType: 'payments' };
	return exports.saveBulkData(req, res);
};

exports.saveTablesNewBulk = async (req, res) => {
	req.body = { dataType: 'tables' };
	return exports.saveBulkData(req, res);
};

exports.savePhonesBulk = async (req, res) => {
	req.body = { dataType: 'phones' };
	return exports.saveBulkData(req, res);
};

exports.searchCustomer = async (req, res) => {
	try {
		const { customer } = req.query;
		if(customer) {
			const data = await Customer.aggregate([
				{$match:{$or:[{"fullName":{$regex:'.*' + customer + '.*',$options: 'i'}},]}},
			]);
			res.send({success: true, customers: data});
		} else {
			res.send({success: false, message: "Search string is empty!"});
		}
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error searching customers", error });
	}
};

exports.hasTicketsBulk = async (req,res) => {
	try {
		let data = await Customer.find()
		let status;
		data.map(async (item) => {
			let findTicket = await Ticket.find({customerId: item.customerId}) 
			if (findTicket.length > 0){
				status = 'Closed'
				findTicket.map((item1) => {
					if (item1.ticketStatus != 'Closed') status = item1.ticketStatus;
				})
			} else status = 'Non'
			await Customer.updateOne({customerId: item.customerId},{ticketExist: status})	
		})
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error hasTicketsBulk", error });
	}
};

exports.getNoClose = async (req,res) => {
	try {
		let data = await Ticket.find({ticketStatus: {$ne: 'Closed'}})
		return res.send (data)
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error hasTicketsBulk", error });
	}
};

exports.getTables = async (req,res) => {
	try {
		let table = {}
		let data = ''

		data = await Table.find({table_id: 2})
		data = data.map((item) => {
			return item.description
		})
		table.remarkList = data

		data = await Table.find({table_id: 3})
		data = data.map((item) => {
			return ({item:item.description, price:item.table_code})
		})
		table.itemList = data

		data = await Table.find({table_id: 4})
		data = data.map((item) => {
			return item.description
		})
		table.defectList = data

		data = await Table.find({table_id: 5})
		data = data.map((item) => {
			return item.description
		})
		table.defectFoundList = data

		data = await Table.find({table_id: 6})
		data = data.map((item) => {
			return item.description
		})
		table.defectFixesList = data

		data = await Table.find({table_id: 11})
		data = data.map((item) => {
			return item.description
		})
		table.accessoriesList = data
		
		data = await Table.find({table_id: 12})
		data = data.map((item) => {
			return item.description
		})
		table.entryConditionList = data
		
		data = await Table.find({table_id: 16})
		data = data.map((item) => {
			return item.description
		})
		table.ticketRemarkList = data


		return res.send (table)
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error hasTicketsBulk", error });
	}
};

exports.getDbInfo = (req,res) => {
	try {
		const local = url.includes('127.0.0.1');
		return res.send({ success: true, local , production: !local});
	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error getting db info", error });
	}
};

exports.sendMessageToUser = async (req, res) => {
	const { message,phone } = req.body;

	if(message && phone) {

		client.messages.create({
			body: message,
			from: 'whatsapp:+14155238886',
			to: `whatsapp:${phone}`
		})
		.then(message => {
			
			// console.log(message);
			res.send({ success: true, message: "Successfully sent message" });

		}).catch((error) => {
			console.log(error);
			res.status(500).send({ message: "Error while sending message to user! ", error });
		});	
	} else {
		return res.send({success: false, message: 'Please provide message and phone both!'});
	}
};

exports.getWithRemark = async (req, res) => {
	// Here - req.query consist the find arguments
	let data = {};
	if (Object.values(req.query) == 'ALL') {
		data = await Ticket.find({ticketStatus: {$ne: 'Closed'}})
	} else { 
		data = await Ticket.find(req.query)
	}
	
	// if have customer remark, add it to the object
	let data1 = await Promise.all (data.map(async(item) => {
		let customer = await Customer.findOne({customerId: item.customerId})
		let remark = customer ? customer.remark : ''
		return ({...item._doc, customerRemark: remark})
	}))
	return res.send (data1)
};

exports.createExcel = async (req, res) => {
  const ts = moment().format('YYYY-MM-DD_HH-mm-ss');
  const folderId = process.env.BACKUP_DRIVE_FOLDER_ID;
  await fsp.mkdir(TMP_DIR, { recursive: true });

  // Header order for each CSV (ensures all columns appear even if sparse in data)
  const csvHeaders = {
    tickets: ['ticketId', 'ticketStatus', 'customerId', 'customerName', 'item', 'entryCondition', 'accessories', 'defectDescription', 'defectFound', 'defectFixes', 'prepaid', 'prepaidInvoice', 'amount', 'vat', 'total', 'invoice', 'year', 'entryDate', 'fixDate', 'exitDate', 'remarks', 'ticketRemark', 'fixHour', 'fixMin', 'partsCost'],
    customers: ['customerId', 'fullName', 'address', 'city', 'phone1', 'phone2', 'phone3', 'arrivedFrom', 'issueDate', 'hasTicket', 'ticketExist', 'remark'],
    invoices: ['invoiceId', 'customerId', 'ticketId', 'amount', 'vat', 'total', 'remark'],
    payments: ['supplierId','paymentId', 'checkId', 'date', 'amount', 'remark'],
    tables: ['table_id', 'table_code', 'description', 'numeric'],
    phones: ['fullName', 'address', 'phone1', 'phone2', 'phone3', 'phone4', 'phoneType', 'remark']
  };

  // names and data-fetch promises (keeps order predictable)
  const tasks = [
    { key: 'tickets', dataPromise: Ticket.find().lean() },
    { key: 'customers', dataPromise: Customer.find().lean() },
    { key: 'invoices', dataPromise: Invoice.find().lean() },
    { key: 'payments', dataPromise: Payment.find().lean() },
    { key: 'tables', dataPromise: Table.find().lean() },
    { key: 'phones', dataPromise: Phone.find().lean() }
  ];

  let createdCsvFiles = [];
  const zipPath = path.join(TMP_DIR, `shlomi-backup-${ts}.zip`);

  try {
    // fetch all data in parallel
    const datas = await Promise.all(tasks.map(t => t.dataPromise));

    // write CSV files in parallel
    const writePromises = tasks.map((t, idx) => {
      const filename = `${t.key}-${ts}.csv`;
      const filePath = path.join(TMP_DIR, filename);
      return backupUtils.writeCsv(filePath, datas[idx], csvHeaders[t.key])
        .then(() => ({ path: filePath, name: `${t.key}.csv` }));
    });

    createdCsvFiles = await Promise.all(writePromises);

    // create zip with the CSV files
    await backupUtils.zipFiles(zipPath, createdCsvFiles);

    // upload the single zip file
    // const uploadRes = await google.uploadFile(zipPath, folderId);
	const uploadRes = await googleSubmoduleService.uploadFileToDrive(zipPath, folderId);
	
    // cleanup CSVs + zip (best-effort)
    const cleanupPaths = createdCsvFiles.map(f => f.path).concat([zipPath]);
    await Promise.all(cleanupPaths.map(p => fsp.unlink(p).catch(() => {})));

    // respond with the zip filename
    return res.json({
      success: true,
      link: uploadRes.webViewLink,
      fileId: uploadRes.id,
      file: { filename: path.basename(zipPath) }
    });

  } catch (err) {
    console.error('createExcel (CSV+ZIP) error:', err);

    // best-effort cleanup if anything was created
    try {
      const cleanup = (createdCsvFiles || []).map(f => f.path);
      if (fs.existsSync(zipPath)) cleanup.push(zipPath);
      await Promise.all(cleanup.map(p => fsp.unlink(p).catch(() => {})));
    } catch (e) {
      /* ignore cleanup errors */
    }

    return res.status(500).send({ message: 'Error creating backup', error: err.message || err });
  }
};

function unLinkFile(path) {
	fs.unlinkSync(path);
}


exports.testGoogleConnection = async (req, res) => {
  try {
    const oAuth2Client = googleSubmoduleService.getOAuthClientFromStoredTokens();

    return res.send({
      success: true,
      message: 'Google submodule is connected',
      hasCredentials: !!oAuth2Client.credentials
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: error.message
    });
  }
};