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
donationRouter.get("/download", downloadExcel); 
donationRouter.get("/", listByDate); 

module.exports = donationRouter;



