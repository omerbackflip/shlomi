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
const path = require('path');
const backupConfig = require('../backup/backup.config');
const { getModel } = require('../backup/modelResolver');
const googleSubmoduleService = require('../services/google-submodule-service');
const backupService = require('../../backup/backend');

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

function unLinkFile(path) {
	fs.unlinkSync(path);
}

exports.googleConnectionStatus = async (req, res) => {
  try {
    const tokens = googleSubmoduleService.getStoredTokens();

    if (!tokens) {
      return res.send({
        connected: false,
        authUrl: '/api/google/auth'
      });
    }

    return res.send({
      connected: true,
      username: null
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error while checking google connection."
    });
  }
};

exports.runBackup = async (req, res) => {
  try {
    const backupDate = moment().format('DD/MM/YYYY');

    // Update before exporting so tables.csv contains this backup's date.
    await Table.findOneAndUpdate(
      { table_id: 110, table_code: 1 },
      { description: `last backup : ${backupDate}` }
    );

    const result = await backupService.runBackup({
      config: backupConfig,
      getModel,
      uploader: googleSubmoduleService.uploadFileToDrive,
      tmpDir: path.resolve(__dirname, '../../tmp')
    });

    return res.json(result);
  } catch (error) {
    console.error('runBackup error:', error);
    return res.status(500).send({
      message: 'Error creating backup',
      error: error.message || error
    });
  }
};

exports.runRestore = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).send({
        success: false,
        message: 'Backup ZIP file is required'
      });
    }

    if (!req.body || req.body.confirm !== 'YES') {
      return res.status(400).send({
        success: false,
        message: 'Restore requires confirmation: confirm=YES'
      });
    }

    const result = await backupService.runRestore({
      zipPath: req.file.path,
      config: backupConfig,
      getModel,
      tmpDir: path.resolve(__dirname, '../../tmp')
    });

    unLinkFile(req.file.path);

    return res.json(result);
  } catch (error) {
    console.error('runRestore error:', error);

    if (req.file && req.file.path) {
      try {
        unLinkFile(req.file.path);
      } catch (e) {}
    }

    return res.status(500).send({
      message: 'Error restoring backup',
      error: error.message || error
    });
  }
};
