const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  pan: String,
  name: String,
  address: String,
  reason: String,
  method: String,
  amount: Number,
  date: Date,
  receiptNumber: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("Donation", donationSchema);
