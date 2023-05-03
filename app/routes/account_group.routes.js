require('dotenv').config();
const accountGroup = require('../controllers/account_group.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/account-groups', accountGroup.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/account-groups', pagination.setAttributes, accountGroup.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/account-groups/:id', accountGroup.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/account-groups/:id', accountGroup.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/account-groups/:id', accountGroup.delete);
};