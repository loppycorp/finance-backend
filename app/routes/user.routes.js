require('dotenv').config();
const user = require('../controllers/user.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Authenticate user
    app.post(process.env.BASE_URL + '/users/authenticate', user.authenticate);

    // Create new user record
    app.post(process.env.BASE_URL + '/users', user.create);

    // List available user records
    app.get(process.env.BASE_URL + '/users', auth.validateToken, pagination.setAttributes, user.search);

    // View user record
    app.get(process.env.BASE_URL + '/users/:id', auth.validateToken, user.read);

    // Edit user record
    app.put(process.env.BASE_URL + '/users/:id', auth.validateToken, user.update);

    // Delete account record
    app.delete(process.env.BASE_URL + '/users/:id', auth.validateToken, user.delete);
};