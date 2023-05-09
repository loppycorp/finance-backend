require("dotenv").config();
const gl_accounts = require("../controllers/gl_accounts.controller");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new gl accounts
  app.post(process.env.BASE_URL + "/gl-accounts", gl_accounts.create);
  // List available gl accounts
  app.get(
    process.env.BASE_URL + "/gl-accounts",
    pagination.setAttributes,
    gl_accounts.search
  );
  // Edit gl accounts
  app.put(process.env.BASE_URL + "/gl-accounts/:id", gl_accounts.update);
  // Delete gl accounts
  app.delete(process.env.BASE_URL + "/gl-accounts/:id", gl_accounts.delete);
};
