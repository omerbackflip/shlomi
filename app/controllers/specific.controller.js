const db = require("../models");
const Customer = db.customers;
const Ticket = db.tickets;
const Table = db.tables;
const Phone = db.phones;
const dbService = require("../services/db-service");
const specificService = require("../services/specific-service");
const XLSX = require('xlsx');
const fs = require('fs');
const { transformCSVData } = require("../util/util");
const { url } = require("../config/db.config");
const { cursorTo } = require("readline");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.saveCustomersBulk = async (req, res) => {
	try {
        await Customer.deleteMany();
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let customers = specificService.getCustomersToSave(data[0]);
        await dbService.insertMany(Customer,customers);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${customers.length} customers successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving customers", error });
	}
};

exports.saveCustomersNewBulk = async (req, res) => {
	try {
        await Customer.deleteMany();
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let customers = specificService.getCustomersNewToSave(data[0]);
        await dbService.insertMany(Customer,customers);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${customers.length} customers successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving customers", error });
	}
};

exports.saveTicketsBulk = async (req, res) => {
	try {
        await Ticket.deleteMany();
		// var workbook = XLSX.readFile(`uploads/${req.file.filename}`,{type: 'binary', cellDates: true, dateNF: 'yyyy/mm/dd;@'});
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`,{type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy;@'});
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let tickets = specificService.getTicketsToSave(data[0]);
        await dbService.insertMany(Ticket,tickets);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${tickets.length} tickets successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving tickets", error });
	}
};

exports.saveTicketsNewBulk = async (req, res) => {
	try {
        await Ticket.deleteMany();
		// var workbook = XLSX.readFile(`uploads/${req.file.filename}`,{type: 'binary', cellDates: true, dateNF: 'yyyy/mm/dd;@'});
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`,{type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy;@'});
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let tickets = specificService.getTicketsNewToSave(data[0]);
        await dbService.insertMany(Ticket,tickets);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${tickets.length} tickets successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving tickets", error });
	}
};

exports.saveTablesBulk = async (req, res) => {
	try {
        await Table.deleteMany();
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let tables = specificService.getTablesToSave(data[0]);
        await dbService.insertMany(Table,tables);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${tables.length} tables successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving tables", error });
	}
};

exports.saveTablesNewBulk = async (req, res) => {
	try {
        await Table.deleteMany();
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let tables = specificService.getTablesNewToSave(data[0]);
        await dbService.insertMany(Table,tables);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${tables.length} tables successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving tables", error });
	}
};

exports.saveDefectsBulk = async (req, res) => {
	try {
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let defectsArray = specificService.getDefectsToSave(data[0]);
		defectsArray.map(async (item) => {
			let ticket = await dbService.getSingleItem(Ticket,{ticketId: item.ticketId})
			ticket.defectFound = item.defectFound
			ticket.defectFixes = item.defectFixes
			await dbService.updateItem(Ticket,{ticketId:item.ticketId}, ticket)
		})
		
        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${defectsArray.length} defectsArray successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving defectsArray", error });
	}
};

exports.savePhonesBulk = async (req, res) => {
	try {
        await Phone.deleteMany();
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let phones = specificService.getPhonesToSave(data[0]);
        await dbService.insertMany(Phone,phones);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${phones.length} phones successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving phones", error });
	}
};

exports.saveFixTimeBulk = async (req, res) => {
	try {
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`);
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let fixTimeArray = specificService.getFixTimeToSave(data[0]);
		fixTimeArray.map(async (item) => {
			let ticket = dbService.getSingleItem(Ticket,{ticketId: item.ticketId})
			ticket.fixHour = item.fixHour
			ticket.fixMin = item.fixMin
			await dbService.updateItem(Ticket,{ticketId:item.ticketId}, ticket)
		})
		
        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${fixTimeArray.length} fixTimeArray successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving fixTimeArray", error });
	}
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
		const local = url.includes('localhost');
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
		return ({...item._doc, customerRemark: customer.remark})
	}))
	return res.send (data1)
};

// exports.getCustomersWithStatus = async (req,res) => {  // not in used...!!!
// 	try {
// 		let data = await Customer.find().limit(2).lean()
// 		let findTickets = 'Non'
// 		data = data.map( (item) => {
// 			if (item.hasTicket) {
// 				findTickets = Ticket.find ({customerId: item.customerId})
// 			}
// 			// console.log(item.fullName, findTickets.length)
// 			// return (Object.assign({},item, {status : 'status'}))
// 			return ({...item, status : 'status'})
// 		})
// 		console.log(data)
// 		return res.send (data)
// 	} catch (error) {
// 		console.log(error)
// 		res.status(500).send({ message: "Error hasTicketsBulk", error });
// 	}
// };

function unLinkFile(path) {
	fs.unlinkSync(path);
}