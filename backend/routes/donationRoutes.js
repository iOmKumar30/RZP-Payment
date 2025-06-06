/*************  ✨ Windsurf Command 🌟  *************/
const express = require("express");
const {
  saveDonation,
  listRecent,
  listByDate,
  downloadExcel,
} = require("../controllers/donationController");

const donationRouter = express.Router();

donationRouter.post("/", saveDonation);
donationRouter.get("/recent", listRecent);
donationRouter.get("/download", downloadExcel); // ?from=YYYY-MM-DD&to=YYYY-MM-DD
donationRouter.get("/", listByDate); // list with optional date filters


module.exports = donationRouter;


