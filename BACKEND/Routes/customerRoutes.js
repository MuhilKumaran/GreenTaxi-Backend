const express = require("express");
const router = express.Router();
const customerController = require("../Controllers/customerController");

const { validateToken } = require("../JWT");
router.route("/signup").post(customerController.addCustomer);

router.route("/login").post(customerController.getCustomer);

router.route("/booking").post(validateToken, customerController.addBooking);

router
  .route("/support")
  .get(customerController.getSupport)
  .post(validateToken, customerController.sendSupportMessage);

module.exports = router;
