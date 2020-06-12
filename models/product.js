const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
   name: {
      type: String,
      required: true,
   },
   price: {
      type: Number,
      required: true,
   },
   description: {
      type: String,
      required: false,
   },
   // image: {
   //   type: String,
   //   required: false
   // },
   userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
});

module.exports = mongoose.model("Product", productSchema);
