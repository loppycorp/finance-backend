require('dotenv').config();
const profitCenter = require('../controllers/profit_center.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/profit-centers', auth.validateToken, profitCenter.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/profit-centers', auth.validateToken, pagination.setAttributes, profitCenter.search);
    app.get(process.env.BASE_URL + '/profit-centers/:searchTerm', auth.validateToken, pagination.setAttributes, profitCenter.defaultsearch);

    // View profit-center record
    app.get(process.env.BASE_URL + '/profit-centers/:id', auth.validateToken, profitCenter.get);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/profit-centers/:id', auth.validateToken, profitCenter.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/profit-centers/:id', auth.validateToken, profitCenter.delete);
};