require('dotenv').config();
const valuationgroup = require('../controllers/valuation_group.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/valuation-groups', valuationgroup.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/valuation-groups', pagination.setAttributes, valuationgroup.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/valuation-groups/:id', valuationgroup.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/valuation-groups/:id', valuationgroup.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/valuation-groups/:id', valuationgroup.delete);
};