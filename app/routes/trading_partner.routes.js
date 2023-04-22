require('dotenv').config();
const tradingPartner = require('../controllers/trading_partner.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/trading-partners', tradingPartner.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/trading-partners', pagination.setAttributes, tradingPartner.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/trading-partners/:id', tradingPartner.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/trading-partners/:id', tradingPartner.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/trading-partners/:id', tradingPartner.delete);
};