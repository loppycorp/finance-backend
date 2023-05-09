require("dotenv").config();
const defaultController = require("../controllers/gl_account_header.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new gl_account_posting_header
  app.post(
    process.env.BASE_URL + "/gl-account-header",
    auth.validateToken,
    defaultController.create
  );
  // List available gl_account_posting_headerprimary cost element
  app.get(
    process.env.BASE_URL + "/gl-account-header",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit gl_account_posting_header
  app.put(
    process.env.BASE_URL + "/gl-account-header/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete gl_account_posting_header
  app.delete(
    process.env.BASE_URL + "/gl-account-header/:id",
    auth.validateToken,
    defaultController.delete
  );
};
