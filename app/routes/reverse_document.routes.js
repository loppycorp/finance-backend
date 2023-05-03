require("dotenv").config();
const reverse = require("../controllers/reverse_document.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new primary cost element
  app.post(
    process.env.BASE_URL + "/reverse-document",
    auth.validateToken,
    reverse.create
  );
  // List available primary cost element
  app.get(
    process.env.BASE_URL + "/reverse-document",
    auth.validateToken,
    pagination.setAttributes,
    reverse.search
  );
  // Edit primary cost element
  app.put(
    process.env.BASE_URL + "/reverse-document/:id",
    auth.validateToken,
    reverse.update
  );
  // Delete assets
  app.delete(
    process.env.BASE_URL + "/reverse-document/:id",
    auth.validateToken,
    reverse.delete
  );
};
