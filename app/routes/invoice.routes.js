require("dotenv").config();

const defaultController = require("../controllers/invoice.controller");
const pagination = require("../middlewares/pagination.middleware");
const auth = require("../middlewares/authorization.middleware");

module.exports = (app) => {
    app.post(
        process.env.BASE_URL + '/invoice',
        auth.validateToken,
        defaultController.create
    );

    app.get(
        process.env.BASE_URL + '/invoice/:id',
        auth.validateToken,
        defaultController.read
    );

    app.get(
        process.env.BASE_URL + '/invoice/:id/reports',
        defaultController.report
    );

    app.put(
        process.env.BASE_URL + '/invoice/:id',
        auth.validateToken,
        defaultController.update
    );

    app.delete(
        process.env.BASE_URL + '/invoice/:id',
        auth.validateToken,
        defaultController.delete
    );

    app.get(
        process.env.BASE_URL + '/invoice',
        auth.validateToken,
        pagination.setAttributes,
        defaultController.search
    );

    app.put(
        process.env.BASE_URL + '/invoice/:id/posting',
        auth.validateToken,
        defaultController.simulate
    );

    app.put(
        process.env.BASE_URL + '/invoice/:id/status',
        auth.validateToken,
        defaultController.status
    );
};