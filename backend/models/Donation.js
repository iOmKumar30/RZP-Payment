// models/Donation.js
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  pan: String,
  name: String,
  address: String,
  reason: String, // Type of Donation
  method: String, // Mode of Receipt
  amount: Number,
  date: Date,
});
module.exports = mongoose.model("Donation", donationSchema);

