require("dotenv").config();
const defaultController = require("../controllers/check_information.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new information
  app.post(
    process.env.BASE_URL + "/check-information",
    auth.validateToken,
    defaultController.create
  );
  // List available information
  app.get(
    process.env.BASE_URL + "/check-information",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit information
  app.put(
    process.env.BASE_URL + "/check-information/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete information
  app.delete(
    process.env.BASE_URL + "/check-information/:id",
    auth.validateToken,
    defaultController.delete
  );
};
