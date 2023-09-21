require("dotenv").config();
const gl_accounts = require("../controllers/gl_accounts.controller");
const pagination = require("../middlewares/pagination.middleware");
const auth = require("../middlewares/authorization.middleware");

module.exports = (app) => {
  // Create new gl accounts
  app.post(
    process.env.BASE_URL + "/gl-accounts",
    auth.validateToken,
    gl_accounts.create
  );
  // List available gl accounts
  app.get(
    process.env.BASE_URL + "/gl-accounts",
    pagination.setAttributes,
    auth.validateToken,
    gl_accounts.search
  );
  // Edit gl accounts
  //search
  app.get(
    process.env.BASE_URL + "/gl-accounts-search",
    auth.validateToken,
    pagination.setAttributes,
    gl_accounts.defaultsearch
  );
  app.put(
    process.env.BASE_URL + "/gl-accounts/:id",
    auth.validateToken,
    gl_accounts.update
  );
  // Delete gl accounts
  app.delete(
    process.env.BASE_URL + "/gl-accounts/:id",
    auth.validateToken,
    gl_accounts.delete
  );
  // Search gl accounts
  app.get(
    process.env.BASE_URL + "/gl-accounts-search",
    auth.validateToken,
    pagination.setAttributes,
    gl_accounts.defaultsearch
  );
};
