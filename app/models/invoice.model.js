module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      supplierId: Number,
      invoiceId: Number,
      date: Date,
      amount: Number,
      paymentId: Number,
      remark: String,
    },
    { timestamps: true }
  );

  const Invoice = mongoose.model("invoice", schema);
  return Invoice;
};