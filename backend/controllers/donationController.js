const { buildExcel } = require("../utils/excel");
const getFinancialYear = require("../utils/getFinancialYear");
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();
const saveDonation = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const existingDonation = await prisma.donation.findUnique({
      where: { transactionId },
    });
    if (existingDonation) {
      return res
        .status(409)
        .json({ error: "This transaction has already been processed." });
    }
    const financialYear = getFinancialYear();

    // Atomically increment counter for this FY:
    // Using upsert for atomic increment
    const counter = await prisma.counter.upsert({
      where: { financialYear },
      update: { seq: { increment: 1 } },
      create: { financialYear, seq: 1 },
    });

    const serialNumber = counter.seq.toString().padStart(3, "0");
    const receiptNumber = `RELF/FY ${financialYear}/${serialNumber}`;

    const donation = await prisma.donation.create({
      data: {
        ...req.body,
        receiptNumber,
      },
    });

    res
      .status(201)
      .json({ message: "Donation saved", donation, receiptNumber });
  } catch (error) {
    console.error("Error saving donation:", error);
    res.status(500).json({ error: "Error saving donation" });
  }
};

const listRecent = async (_req, res) => {
  const data = await prisma.donation.findMany({
    orderBy: { date: "desc" },
    take: 10,
  });
  res.json(data);
};

const listByDate = async (req, res) => {
  try {
    const { from, to, skip = 0, limit = 10, search = "" } = req.query;
    const where = {};

    if (from && to) {
      where.date = {
        gte: new Date(from),
        lte: new Date(to + "T23:59:59.999Z"),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { pan: { contains: search, mode: "insensitive" } },
        { reason: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { contact: { contains: search, mode: "insensitive" } },
        { receiptNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const data = await prisma.donation.findMany({
      where,
      orderBy: { date: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const totalCount = await prisma.donation.count({ where });
    res.json({
      data,
      totalCount,
    });
  } catch (error) {
    console.error("Error listing donations:", error);
    res.status(500).json({ error: "Error listing donations" });
  }
};

const downloadExcel = async (req, res) => {
  const { from, to } = req.query;
  const where = {};

  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to + "T23:59:59.999Z");
  }

  const data = await prisma.donation.findMany({
    where,
    orderBy: { date: "desc" },
  });

  const formatted = data.map((d, i) => ({
    "SI NO.": i + 1,
    "RECEIPT NO.": d.receiptNumber,
    "PANCARD NO. Of Donor": d.pan || "-",
    "Name of Donor": d.name,
    "Address of Donor": d.address,
    "Type of Donation": d.reason,
    "Mode of Receipt": d.method,
    "Amount of donation (INR)": Number(d.amount).toFixed(2),
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
