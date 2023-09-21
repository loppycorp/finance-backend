require("dotenv").config();
const defaultController = require("../controllers/display_routing.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new account record
  app.post(
    process.env.BASE_URL + "/display-routing",
    auth.validateToken,
    defaultController.create
  );

  // List available account records
  app.get(
    process.env.BASE_URL + "/display-routing",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );

  //search
  app.get(
    process.env.BASE_URL + "/display-routing-search",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.defaultsearch
  );
  // View account record
  app.get(
    process.env.BASE_URL + "/display-routing/:id",
    auth.validateToken,
    defaultController.search
  );

  // Edit account record
  app.put(
    process.env.BASE_URL + "/display-routing/:id",
    auth.validateToken,
    defaultController.update
  );

  // Delete account record
  app.delete(
    process.env.BASE_URL + "/display-routing/:id",
    auth.validateToken,
    defaultController.delete
  );
};
