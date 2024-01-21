module.exports = mongoose => {
	var schema = mongoose.Schema(
		{
			ticketId: Number,
			ticketStatus: String,
			customerId: Number,
			customerName: String,
			item: String,
			entryCondition: [String],
			accessories: [String],
			defectDescription: [String],
			defectFound: [String],
			defectFixes: [String],
			prepaid: Number,
			prepaidInvoice: String,
			amount: Number,
			vat: Number,
			total: Number,
			invoice: String,
			year: Number,
			entryDate: Date,
			fixDate: Date,
			exitDate: Date,
			remarks: String,
			ticketRemark: String,
			fixTime: Date,
			partsCost: Number, 
		},
		{ timestamps: true }
	);

	schema.index({ year: 1});
	schema.index({ ticketStatus: 1});
  
	const Ticket = mongoose.model("ticket", schema);
	return Ticket;
};