require("dotenv").config();
const defaultController = require("../controllers/purchase_order.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new account record
  app.post(
    process.env.BASE_URL + "/purchase-order",
    auth.validateToken,
    defaultController.create
  );

  // List available account records
  app.get(
    process.env.BASE_URL + "/purchase-order",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );

  //search
  app.get(
    process.env.BASE_URL + "/purchase-order-search",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.defaultsearch
  );
  // View account record
  // app.get(process.env.BASE_URL + '/purchase-order/:id', auth.validateToken, defaultController.get);

  // Edit account record
  app.put(
    process.env.BASE_URL + "/purchase-order/:id",
    auth.validateToken,
    defaultController.update
  );

  // Delete account record
  app.delete(
    process.env.BASE_URL + "/purchase-order/:id",
    auth.validateToken,
    defaultController.delete
  );
};
