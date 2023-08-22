require("dotenv").config();
const defaultController = require("../controllers/tax_code.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
    // Create new tax-code
    app.post(
        process.env.BASE_URL + "/tax-code",
        auth.validateToken,
        defaultController.create
    );
    // List available tax-code
    app.get(
        process.env.BASE_URL + "/tax-code",
        auth.validateToken,
        pagination.setAttributes,
        defaultController.search
    );
    // Edit tax-code
    app.put(
        process.env.BASE_URL + "/tax-code/:id",
        auth.validateToken,
        defaultController.update
    );
    // Delete tax-code
    app.delete(
        process.env.BASE_URL + "/tax-code/:id",
        auth.validateToken,
        defaultController.delete
    );
};
