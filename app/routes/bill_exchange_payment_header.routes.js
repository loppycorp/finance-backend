require("dotenv").config();
const defaultController = require("../controllers/bill_exchange_payment_header.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new bill-exchange-payment-header
  app.post(
    process.env.BASE_URL + "/bill-exchange-payment-header",
    auth.validateToken,
    defaultController.create
  );
  // List available bill-exchange-payment-header
  app.get(
    process.env.BASE_URL + "/bill-exchange-payment-header",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit bill-exchange-payment-header
  app.put(
    process.env.BASE_URL + "/bill-exchange-payment-header/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete bill-exchange-payment-header
  app.delete(
    process.env.BASE_URL + "/bill-exchange-payment-header/:id",
    auth.validateToken,
    defaultController.delete
  );
};
