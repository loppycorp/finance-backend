require('dotenv').config();
const profitCtrGroup = require('../controllers/profit_center_group.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/profit-center-groups', profitCtrGroup.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/profit-center-groups', pagination.setAttributes, profitCtrGroup.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/profit-center-groups/:id', profitCtrGroup.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/profit-center-groups/:id', profitCtrGroup.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/profit-center-groups/:id', profitCtrGroup.delete);
};