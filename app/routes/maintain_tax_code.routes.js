require("dotenv").config();
const defaultController = require("../controllers/maintain_tax_code.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new account record
  app.post(
    process.env.BASE_URL + "/maintain-tax-code",
    auth.validateToken,
    defaultController.create
  );

  // List available account records
  app.get(
    process.env.BASE_URL + "/maintain-tax-code",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );

  // View account record
  app.get(
    process.env.BASE_URL + "/maintain-tax-code/:id",
    auth.validateToken,
    defaultController.search
  );

  //search
  app.get(
    process.env.BASE_URL + "/maintain-tax-code-search",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.defaultsearch
  );
  // Edit account record
  app.put(
    process.env.BASE_URL + "/maintain-tax-code/:id",
    auth.validateToken,
    defaultController.update
  );

  // Delete account record
  app.delete(
    process.env.BASE_URL + "/maintain-tax-code/:id",
    auth.validateToken,
    defaultController.delete
  );
};
