require('dotenv').config();
const accountGroup = require('../controllers/gl_account_group.controller');
const pagination = require('../middlewares/pagination.middleware');
const auth = require('../middlewares/authorization.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/account-groups', auth.validateToken, accountGroup.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/account-groups', auth.validateToken, pagination.setAttributes, accountGroup.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/account-groups/:id', auth.validateToken, accountGroup.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/account-groups/:id', auth.validateToken, accountGroup.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/account-groups/:id', auth.validateToken, accountGroup.delete);
};