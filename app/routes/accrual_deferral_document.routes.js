require("dotenv").config();
const defaultController = require("../controllers/accrual_deferral_document.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new accrual_deferral_document
  app.post(
    process.env.BASE_URL + "/accrual-deferral-document",
    auth.validateToken,
    defaultController.create
  );
  //search
  app.get(
    process.env.BASE_URL + "/accrual-deferral-document-search",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.defaultsearch
  );
  // List available accrual_deferral_document
  app.get(
    process.env.BASE_URL + "/accrual-deferral-document",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit accrual_deferral_document
  app.put(
    process.env.BASE_URL + "/accrual-deferral-document/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete accrual_deferral_document
  app.delete(
    process.env.BASE_URL + "/accrual-deferral-document/:id",
    auth.validateToken,
    defaultController.delete
  );
};
