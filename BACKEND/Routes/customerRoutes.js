const express = require("express");
const router = express.Router();
const customerController = require("../Controllers/customerController");

const { validateToken } = require("../JWT");
router
  .route("/signup")
  .post(customerController.checksignUpBody, customerController.addCustomer);

router
  .route("/login")
  .post(customerController.checkLoginBody, customerController.getCustomer);

router
  .route("/booking")
  .post(validateToken,);

router
  .route("/support")
  .post(validateToken, customerController.sendSupportMessage);

module.exports = router;
