require("dotenv").config();
const defaultController = require("../controllers/fixed_asset.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
    // Create new 
    app.post(process.env.BASE_URL + "/fixed-asset", auth.validateToken, defaultController.create);
    // List available 
    app.get(process.env.BASE_URL + "/fixed-asset", auth.validateToken, pagination.setAttributes, defaultController.search);
    // Edit 
    app.put(process.env.BASE_URL + "/fixed-asset/:id", auth.validateToken, defaultController.update);
    // Delete 
    app.delete(process.env.BASE_URL + "/fixed-asset/:id", auth.validateToken, defaultController.delete);
};
