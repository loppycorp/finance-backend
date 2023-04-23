require('dotenv').config();
const currency = require('../controllers/currency.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new currency record
    app.post(process.env.BASE_URL + '/currency', currency.create);

    // List available currency records
    app.get(process.env.BASE_URL + '/currency', pagination.setAttributes, currency.search);

    // View currency record
    app.get(process.env.BASE_URL + '/currency/:id', currency.read);

    // Edit currency record
    app.put(process.env.BASE_URL + '/currency/:id', currency.update);

    // Delete currency record
    app.delete(process.env.BASE_URL + '/currency/:id', currency.delete);
}