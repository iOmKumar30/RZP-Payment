const Donation = require("../models/Donation");
const { buildExcel } = require("../utils/excel");

const Counter = require("../models/Counter");
const getFinancialYear = require("../utils/getFinancialYear");

const saveDonation = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const existingDonation = await Donation.findOne({ transactionId });
    if (existingDonation) {
      return res
        .status(409)
        .json({ error: "This transaction has already been processed." });
    }
    const financialYear = getFinancialYear();

    // Atomically increment counter for this FY:
    const counter = await Counter.findOneAndUpdate(
      { financialYear },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const serialNumber = counter.seq.toString().padStart(3, "0");
    const receiptNumber = `RELF/FY ${financialYear}/${serialNumber}`;

    const donation = new Donation({
      ...req.body,
      receiptNumber,
    });

    await donation.save();

    res
      .status(201)
      .json({ message: "Donation saved", donation, receiptNumber });
  } catch (error) {
    console.error("Error saving donation:", error);
    res.status(500).json({ error: "Error saving donation" });
  }
};

const listRecent = async (_req, res) => {
  const data = await Donation.find().sort({ date: -1 }).limit(10);
  res.json(data);
};

const listByDate = async (req, res) => {
  try {
    const { from, to, skip = 0, limit = 10, search = "" } = req.query;
    const query = {};

    if (from && to) {
      query.date = {
        $gte: new Date(from),
        $lte: new Date(to + "T23:59:59.999Z"), // to include the entire end date(very last millisecond of that day)
      };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i"); // case-insensitive
      query.$or = [
        { name: searchRegex },
        { address: searchRegex },
        { pan: searchRegex },
        { reason: searchRegex },
        { email: searchRegex },
        { contact: searchRegex },
        { receiptNumber: searchRegex },
      ];
    }
    const data = await Donation.find(query)
      .sort({ date: -1 }) // latest first
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalCount = await Donation.countDocuments(query);
    res.json({
      data,
      totalCount, // send this so frontend can know total pages
    });
  } catch (error) {
    console.error("Error listing donations:", error);
    res.status(500).json({ error: "Error listing donations" });
  }
};

const downloadExcel = async (req, res) => {
  const { from, to } = req.query;
  const query = {};

  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to + "T23:59:59.999Z");
  }

  const data = await Donation.find(query).sort({ date: -1 });

  const formatted = data.map((d, i) => ({
    "SI NO.": i + 1,
    "RECEIPT NO.": d.receiptNumber,
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
