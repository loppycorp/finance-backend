require('dotenv').config();
const defaultController = require('../controllers/customer_pymnt_transc.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new account record
    app.post(process.env.BASE_URL + '/customer-pymnt-transc', auth.validateToken, defaultController.create);

    // List available account records
    app.get(process.env.BASE_URL + '/customer-pymnt-transc', auth.validateToken, pagination.setAttributes, defaultController.search);

    // View account record
    app.get(process.env.BASE_URL + '/customer-pymnt-transc/:id', auth.validateToken, defaultController.read);

    // Edit account record
    app.put(process.env.BASE_URL + '/customer-pymnt-transc/:id', auth.validateToken, defaultController.update);

    // Delete account record
    app.delete(process.env.BASE_URL + '/customer-pymnt-transc/:id', auth.validateToken, defaultController.delete);
};