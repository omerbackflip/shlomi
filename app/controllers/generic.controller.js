const db = require("../models");
const dbService = require("../services/db-service");
const paymentService = require("../services/specific-service");

//Create and Save a new entity:
exports.create = async (req, res) => {
	try {
		const entity = { ...req.body };
		const data = await dbService.createItem(db[req.query.model], entity);
		if(req.query.middleware) {
			paymentService[req.query.middleware](db,data);
		}
		if (data) {
			res.send({data , message: "Entity created successfully!"});
		}
	} catch (error) {
		console.log(error);
		res.status(500).send({message: error.message || "Some error occurred while retrieving entity."});
	}
};

exports.findAll = async (req, res) => {
	try {
		const model = req.query.model;
		let data = await dbService.getMultipleItems(db[model], req.query);
		return res.send(data);
	} catch (error) {
		res.status(500).send({message: error.message || "Some error occurred while retrieving entity."});		
	}
};


//Find a single entity with an id:
exports.findOne = async (req, res) => {
	try {
		const id = req.params.id;
		return res.send(await dbService.getSingleItem(db[req.query.model], {_id: id}));
	} catch (error) {
		res.status(500).send({ message: "Error retrieving entity!"});		
	}
};


//Find a single entity with an any other field:
exports.findSingle = async (req, res) => {
	try {
		let data = await dbService.getSingleItem(db[req.query.model], req.query);
		// console.log(data)
		return res.send(data);
	} catch (error) {
		res.status(500).send({ message: "Error retrieving entity!"});		
	}
};

//Update a entity identified by the id in the request:
exports.update = async (req, res) => {
	try {
		console.log(req.body)
		const id = req.params.id;
		const data = await dbService.updateItem(db[req.query.model], {_id: id}, req.body);
		if(data) {
			res.send({ data, message: "entity was updated successfully." });
		} else {
			res.status(404).send({message: `Cannot update entity with id=${id}. Maybe entity was not found!`});
		}
	} catch (error) {
		res.status(500).send({ message: "Error updating entity!"});		
	}
};


//Delete a entity with the specified id:
exports.delete = async (req, res) => {
	try {
		const id = req.query.id;
		const data = await dbService.deleteItem(db[req.query.model], {_id: id});
		if(data) {
			res.send({ message: "entity was deleted successfully." });
		} else {
			res.status(404).send({message: `Cannot delete entity with id=${id}. Maybe entity was not found!`});
		}
	} catch (error) {
		res.status(500).send({ message: "Error updating entity!"});		
	}
};


//Delete all Table
exports.deleteAll = async (req, res) => {
	try {
		const query = {... req.query};
		const model = req.query.model;
		delete query.model;

		const data = await dbService.deleteMany(db[model], query);
		if(data) {
			res.send({
				message: `${data.deletedCount} data were deleted successfully!`
			});
		}
	} catch (error) {
		res.status(500).send({
			message:
				err.message || "Some error occurred while removing all data."
		});
	}
};
