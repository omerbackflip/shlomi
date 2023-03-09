const db = require("../models");
const Customer = db.customers;
const Ticket = db.tickets;
const Table = db.tables;
const dbService = require("../services/db-service");
const specificService = require("../services/specific-service");
const XLSX = require('xlsx');
const fs = require('fs');
const { transformCSVData } = require("../util/util");

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
		res.status(500).send({ message: "Error saving payments", error });
	}
};

exports.saveTicketsBulk = async (req, res) => {

	try {
        await Ticket.deleteMany();
		var workbook = XLSX.readFile(`uploads/${req.file.filename}`,{type: 'binary', cellDates: true, dateNF: 'yyyy/mm/dd;@'});
		var sheet_name_list = workbook.SheetNames;
		const data = transformCSVData(sheet_name_list , workbook);

        let tickets = specificService.getTicketsToSave(data[0]);
        await dbService.insertMany(Ticket,tickets);

        unLinkFile(`uploads/${req.file.filename}`);
        return res.send({ success: true, message: `Total ${tickets.length} tickets successfully Imported`});

	} catch (error) {
		console.log(error)
		res.status(500).send({ message: "Error saving payments", error });
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
		res.status(500).send({ message: "Error saving payments", error });
	}
};

function unLinkFile(path) {
	fs.unlinkSync(path);
}