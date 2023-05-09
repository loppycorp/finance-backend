require("dotenv").config();
const documentHeaderController = require("../controllers/gl_account_document_header.controller");
const documentItemController = require("../controllers/gl_account_document_item.controller");
const pagination = require("../middlewares/pagination.middleware");
const auth = require("../middlewares/authorization.middleware");

module.exports = (app) => {
    // ***************** Routes - Document Headers *****************
    app.get(
        process.env.BASE_URL + '/gl-account-document-headers',
        auth.validateToken,
        pagination.setAttributes,
        documentHeaderController.search
    );

    app.get(
        process.env.BASE_URL + '/gl-account-document-headers/:id',
        auth.validateToken,
        documentHeaderController.get
    );

    app.post(
        process.env.BASE_URL + '/gl-account-document-headers',
        auth.validateToken,
        documentHeaderController.create
    );

    app.put(
        process.env.BASE_URL + '/gl-account-document-headers/:id',
        auth.validateToken,
        documentHeaderController.update
    );

    app.delete(
        process.env.BASE_URL + '/gl-account-document-headers/:id',
        auth.validateToken,
        documentHeaderController.delete
    ); 

    // ***************** Routes - Document Items *****************
    {
        app.get(
            process.env.BASE_URL + '/gl-account-document-headers/:id/items',
            auth.validateToken,
            documentItemController.search
        );

        app.post(
            process.env.BASE_URL + '/gl-account-document-headers/:id/items',
            auth.validateToken,
            documentItemController.create
        );

        app.put(
            process.env.BASE_URL + '/gl-account-document-headers/:id/items/:item_id',
            auth.validateToken,
            documentItemController.update
        );

        app.get(
            process.env.BASE_URL + '/gl-account-document-headers/:id/items/:item_id',
            auth.validateToken,
            documentItemController.get
        );

        app.delete(
            process.env.BASE_URL + '/gl-account-document-headers/:id/items/:item_id',
            auth.validateToken,
            documentItemController.delete
        );
    }
};
