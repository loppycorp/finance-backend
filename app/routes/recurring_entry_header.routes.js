require("dotenv").config();
const defaultController = require("../controllers/recurring_entry_header.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new primary cost element
  app.post(
    process.env.BASE_URL + "/recurring-entry-header",
    auth.validateToken,
    defaultController.create
  );
  // List available primary cost element
  app.get(
    process.env.BASE_URL + "/recurring-entry-header",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit primary cost element
  app.put(
    process.env.BASE_URL + "/recurring-entry-header/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete assets
  app.delete(
    process.env.BASE_URL + "/recurring-entry-header/:id",
    auth.validateToken,
    defaultController.delete
  );
};
