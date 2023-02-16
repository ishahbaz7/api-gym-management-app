const express = require("express");
const invoiceController = require("../controllers/invoiceController");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/trainee-invoice/:id", isAuth, invoiceController.getTraineeInvoice);

// router.get("/collections", isAuth, invoiceController.getCollections);

router.post("/get-collections", isAuth, invoiceController.getCollections);

router.delete("/trainee-invoice/:id", isAuth, invoiceController.deleteInvoice);

router.get("/remaining-balance", isAuth, invoiceController.getRemainingBalance);

router.post(
  "/remaining-balance",
  isAuth,
  invoiceController.postRemainingBalance
);

module.exports = router;
