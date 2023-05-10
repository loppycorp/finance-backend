require('dotenv').config();
const defaultController = require('../controllers/customer_withholding_tax.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new account record
    app.post(process.env.BASE_URL + '/customer-with-holding-tax', auth.validateToken, defaultController.create);

    // List available account records
    app.get(process.env.BASE_URL + '/customer-with-holding-tax', auth.validateToken, pagination.setAttributes, defaultController.search);

    // View account record
    app.get(process.env.BASE_URL + '/customer-with-holding-tax/:id', auth.validateToken, defaultController.get);

    // Edit account record
    app.put(process.env.BASE_URL + '/customer-with-holding-tax/:id', auth.validateToken, defaultController.update);

    // Delete account record
    app.delete(process.env.BASE_URL + '/customer-with-holding-tax/:id', auth.validateToken, defaultController.delete);
};