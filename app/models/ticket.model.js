module.exports = mongoose => {
	var schema = mongoose.Schema(
		{
			ticketId: Number,
			ticketStatus: String,
			customerId: String,
			customerName: String,
			item: String,
			entryCondition: [String],
			accessories: [String],
			defectDescription: [String],
			prepaid: Number,
			prepaidInvoice: String,
			vat: Number,
			invoice: String,
			total: Number,
			year: Number,
			entryDate: Date,
			fixDate: Date,
			exitDate: Date,
			remarks: String,
		},
		{ timestamps: true }
	);

	const Ticket = mongoose.model("ticket", schema);
	return Ticket;
};