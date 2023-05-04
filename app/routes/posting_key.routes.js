require("dotenv").config();
const defaultController = require("../controllers/posting_key.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create newposting-key
  app.post(
    process.env.BASE_URL + "/posting-key",
    auth.validateToken,
    defaultController.create
  );
  // List available posting-key
  app.get(
    process.env.BASE_URL + "/posting-key",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );
  // Edit posting-key
  app.put(
    process.env.BASE_URL + "/posting-key/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete posting-key
  app.delete(
    process.env.BASE_URL + "/posting-key/:id",
    auth.validateToken,
    defaultController.delete
  );
};
