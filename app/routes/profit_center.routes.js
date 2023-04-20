require('dotenv').config();
const profitCenter = require('../controllers/profit_center.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/profit-centers', profitCenter.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/profit-centers', pagination.setAttributes, profitCenter.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/profit-centers/:id', profitCenter.get);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/profit-centers/:id', profitCenter.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/profit-centers/:id', profitCenter.delete);
};