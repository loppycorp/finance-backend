require("dotenv").config();
const defaultController = require("../controllers/display_production_order.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new account record
  app.post(
    process.env.BASE_URL + "/display-production-order",
    auth.validateToken,
    defaultController.create
  );

  // List available account records
  app.get(
    process.env.BASE_URL + "/display-production-order",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );

  // View account record
  app.get(
    process.env.BASE_URL + "/display-production-order/:id",
    auth.validateToken,
    defaultController.search
  );

  //search
  app.get(
    process.env.BASE_URL + "/display-production-order-search",
    pagination.setAttributes,
    defaultController.defaultsearch
  );
  // Edit account record
  app.put(
    process.env.BASE_URL + "/display-production-order/:id",
    auth.validateToken,
    defaultController.update
  );

  // Delete account record
  app.delete(
    process.env.BASE_URL + "/display-production-order/:id",
    auth.validateToken,
    defaultController.delete
  );
};
