require("dotenv").config();
const defaultController = require("../controllers/order_type.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create neworder-type
  app.post(
    process.env.BASE_URL + "/order-type",
    auth.validateToken,
    defaultController.create
  );
  // List available order-type
  app.get(
    process.env.BASE_URL + "/order-type",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit order-type
  app.put(
    process.env.BASE_URL + "/order-type/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete order-type
  app.delete(
    process.env.BASE_URL + "/order-type/:id",
    auth.validateToken,
    defaultController.delete
  );
};
