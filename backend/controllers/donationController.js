const Donation = require("../models/Donation");
const { buildExcel } = require("../utils/excel");

const saveDonation = async (req, res) => {
  const donation = new Donation(req.body);
  await donation.save();
  res.status(201).json({ message: "Donation saved" });
};

const listRecent = async (_req, res) => {
  const data = await Donation.find().sort({ date: -1 }).limit(10);
  res.json(data);
};

const listByDate = async (req, res) => {
  const { from, to } = req.query;
  const query = {};

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const data = await Donation.find(query).sort({ date: -1 });
  res.json(data);
};

const downloadExcel = async (req, res) => {
  const { from, to } = req.query;
  const query = {};

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  const data = await Donation.find(query).sort({ date: -1 });

  const formatted = data.map((d, i) => ({
    "SI NO.": i + 1,
    "PANCARD NO. Of Donor": d.pan || "-",
    "Name of Donor": d.name,
    "Address of Donor": d.address,
    "Type of Donation": d.reason,
    "Mode of Receipt": d.method,
    "Amount of donation (INR)": d.amount.toFixed(2),
    "Date of Payment": new Date(d.date).toLocaleDateString("en-IN"),
  }));

  const buffer = await buildExcel(formatted);
  res.setHeader("Content-Disposition", "attachment; filename=donations.xlsx");
  res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
};

module.exports = {
  saveDonation,
  listRecent,
  listByDate,
  downloadExcel,
};
