require("dotenv").config();
const defaultController = require("../controllers/customer_invoice_header.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new customer-invoice-header
  app.post(
    process.env.BASE_URL + "/customer-invoice-header",
    auth.validateToken,
    defaultController.create
  );
  // List available customer-invoice-header
  app.get(
    process.env.BASE_URL + "/customer-invoice-header-search",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );

  // Edit customer-invoice-header
  app.put(
    process.env.BASE_URL + "/customer-invoice-header/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete customer-invoice-header
  app.delete(
    process.env.BASE_URL + "/customer-invoice-header/:id",
    auth.validateToken,
    defaultController.delete
  );
};
