module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
			fullName: String,
			phone1: String,				
			phone2: String,
			phone3: String,
			phone4: String,
			address: String,
      phoneType: String,
      remark: String,
    },
    { timestamps: true }
  );

  const Phone = mongoose.model("phone", schema);
  return Phone;
};