require("dotenv").config();
const defaultController = require("../controllers/document_type.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new document-type
  app.post(
    process.env.BASE_URL + "/document-type",
    auth.validateToken,
    defaultController.create
  );
  // List available document-type
  app.get(
    process.env.BASE_URL + "/document-type",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit document-type
  app.put(
    process.env.BASE_URL + "/document-type/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete document-type
  app.delete(
    process.env.BASE_URL + "/posting-key/:id",
    auth.validateToken,
    defaultController.delete
  );
};
