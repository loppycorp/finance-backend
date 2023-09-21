require("dotenv").config();
const subassets = require("../controllers/sub_assets.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new primary cost element
  app.post(
    process.env.BASE_URL + "/sub-assets",
    auth.validateToken,
    subassets.create
  );
  // List available primary cost element
  app.get(
    process.env.BASE_URL + "/sub-assets",
    auth.validateToken,
    pagination.setAttributes,
    subassets.search
  );
  // Edit primary cost element
  app.put(
    process.env.BASE_URL + "/sub-assets/:id",
    auth.validateToken,
    subassets.update
  );
  // Delete assets
  app.delete(
    process.env.BASE_URL + "/sub-assets/:id",
    auth.validateToken,
    subassets.delete
  );
  //search
  app.get(
    process.env.BASE_URL + "/sub-assets-search",
    auth.validateToken,
    pagination.setAttributes,
    subassets.defaultsearch
  );
};
