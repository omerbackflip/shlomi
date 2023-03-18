module.exports = mongoose => {
	var schema = mongoose.Schema(
		{
			ticketId: Number,
			ticketStatus: String,
			customerId: String,
			customerName: String,
			itemCode: Number,
			item: String,
			accessories: [String],
			defectDescription: [String],
			entryCondition: [String],
			defectsFound: [String],
			defectFixes: [],
			entryDate: Date,
			checkPrice: Number,
			defaultFixPrice: Number,
			prepaid: Number,
			prepaidInvoice: String,
			discount: Number,
			discountPrice: Number,
			vat: Number,
			total: Number,
			approved: String,
			fixDate: Date,
			exitDate: Date,
			paid: String,
			rFinal: Number,
			receipt: Number,
			invoice: String,
			archive: String,
			partsCost: Number,
			elapseTime: Date,
			repairPrice: Number,
			remarks: String,
		},
		{ timestamps: true }
	);

	const Ticket = mongoose.model("ticket", schema);
	return Ticket;
};