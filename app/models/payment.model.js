module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      supplierId: Number,
      paymentId: Number,
      checkId: Number,
      date: Date,
      amount: Number,
    },
    { timestamps: true }
  );

  const Payment = mongoose.model("payment", schema);
  return Payment;
};