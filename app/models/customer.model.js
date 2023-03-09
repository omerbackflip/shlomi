module.exports = mongoose => {
	const schema = mongoose.Schema(
		{
			customerId: Number,
			name: String,
			family: String,
			address: String,
			city: String,
			phone1: String,				
			phone2: String,
			phone3: String,
			arrivedFrom: String,
			issueDate: Date,
		},
		{ timestamps: true }
	);

	const Customer = mongoose.model("customer", schema);
	return Customer;
};