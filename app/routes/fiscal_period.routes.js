require("dotenv").config();
const defaultController = require("../controllers/fiscal_period.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new fiscal-period
  app.post(
    process.env.BASE_URL + "/fiscal-period",
    auth.validateToken,
    defaultController.create
  );
  // List available fiscal-period
  app.get(
    process.env.BASE_URL + "/fiscal-period",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit fiscal-period
  app.put(
    process.env.BASE_URL + "/fiscal-period/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete fiscal-period
  app.delete(
    process.env.BASE_URL + "/fiscal-period/:id",
    auth.validateToken,
    defaultController.delete
  );
};
