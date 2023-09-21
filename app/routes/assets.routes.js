require("dotenv").config();
const assets = require("../controllers/assets.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new primary cost element
  app.post(process.env.BASE_URL + "/assets", auth.validateToken, assets.create);
  // List available primary cost element
  app.get(
    process.env.BASE_URL + "/assets",
    auth.validateToken,
    pagination.setAttributes,
    assets.search
  );
  // Edit primary cost element
  app.put(
    process.env.BASE_URL + "/assets/:id",
    auth.validateToken,
    assets.update
  );
  // Delete assets
  app.delete(
    process.env.BASE_URL + "/assets/:id",
    auth.validateToken,
    assets.delete
  );
  //search
  app.get(
    process.env.BASE_URL + "/assets-search",
    auth.validateToken,
    pagination.setAttributes,
    assets.defaultsearch
  );
};
