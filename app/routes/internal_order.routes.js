require('dotenv').config();
const internal_order = require('../controllers/internal_order.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new primary cost element
    app.post(process.env.BASE_URL + '/internal-order', internal_order.create);
    // List available primary cost element
    app.get(process.env.BASE_URL + '/internal-order', pagination.setAttributes, internal_order.search);
    // Edit primary cost element
    app.put(process.env.BASE_URL + '/internal-order/:id', internal_order.update);
    // Delete internal_order 
    app.delete(process.env.BASE_URL + '/internal-order/:id', internal_order.delete);

};