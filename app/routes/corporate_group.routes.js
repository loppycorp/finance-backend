require('dotenv').config();
const corporateGroup = require('../controllers/corporate_group.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/corporate-groups', corporateGroup.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/corporate-groups', pagination.setAttributes, corporateGroup.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/corporate-groups/:id', corporateGroup.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/corporate-groups/:id', corporateGroup.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/trading-partners/:id', corporateGroup.delete);
};