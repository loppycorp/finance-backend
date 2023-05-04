require("dotenv").config();
const defaultController = require("../controllers/sample_document.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new accrual_deferral_document
  app.post(
    process.env.BASE_URL + "/sample-document",
    auth.validateToken,
    defaultController.create
  );
  // List available accrual_deferral_document
  app.get(
    process.env.BASE_URL + "/sample-document",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit accrual_deferral_document
  app.put(
    process.env.BASE_URL + "/sample-document/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete accrual_deferral_document
  app.delete(
    process.env.BASE_URL + "/sample-document/:id",
    auth.validateToken,
    defaultController.delete
  );
};
