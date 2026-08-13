module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      itemCode: { type: Number, required: true },
      partId: { type: Number, required: true },
      description: { type: String, required: true, trim: true },
      customerPrice: { type: Number, required: true, min: 0 },
      labPrice: { type: Number, required: true, min: 0 },
      companyPrice: { type: Number, required: true, min: 0 },
      remark: { type: String, default: "", trim: true },
    },
    { timestamps: true }
  );

  schema.index({ itemCode: 1, partId: 1 }, { unique: true });
  schema.index({ description: 1 });

  return mongoose.model("priceListPart", schema);
};
