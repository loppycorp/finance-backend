require('dotenv').config();
const defaultController = require('../controllers/sort_key.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new hierarcy area record
    app.post(process.env.BASE_URL + '/sort-keys', auth.validateToken, defaultController.create);

    // List available hierarcy area records
    app.get(process.env.BASE_URL + '/sort-keys', auth.validateToken, pagination.setAttributes, defaultController.search);

    // View hierarcy area record
    app.get(process.env.BASE_URL + '/sort-keys/:id', auth.validateToken, defaultController.read);

    // Edit hierarcy area record
    app.put(process.env.BASE_URL + '/sort-keys/:id', auth.validateToken, defaultController.update);

    // Delete hierarcy area record
    app.delete(process.env.BASE_URL + '/sort-keys/:id', auth.validateToken, defaultController.delete);
}