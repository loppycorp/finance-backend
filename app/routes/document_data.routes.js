require("dotenv").config();

const defaultController = require("../controllers/document_data.controller");
const pagination = require("../middlewares/pagination.middleware");
const auth = require("../middlewares/authorization.middleware");

module.exports = (app) => {
    app.post(
        process.env.BASE_URL + '/document-data',
        auth.validateToken,
        defaultController.create
    );

    app.get(
        process.env.BASE_URL + '/document-data/:id',
        auth.validateToken,
        defaultController.read
    );

    app.put(
        process.env.BASE_URL + '/document-data/:id',
        auth.validateToken,
        defaultController.update
    );

    app.delete(
        process.env.BASE_URL + '/document-data/:id',
        auth.validateToken,
        defaultController.delete
    );

    app.get(
        process.env.BASE_URL + '/document-data',
        auth.validateToken,
        pagination.setAttributes,
        defaultController.search
    );

    app.put(
        process.env.BASE_URL + '/document-data/:id/posting',
        auth.validateToken,
        defaultController.simulate
    );

    app.put(
        process.env.BASE_URL + '/document-data/:id/status',
        auth.validateToken,
        defaultController.status
    );
};