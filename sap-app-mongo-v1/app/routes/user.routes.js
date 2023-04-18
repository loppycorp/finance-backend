require('dotenv').config();
const user = require('../controllers/user.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new account record
    app.post(process.env.BASE_URL + '/users', user.create);

    // List available account records
    app.get(process.env.BASE_URL + '/users', pagination.setAttributes, user.search);

    // View account record
    app.get(process.env.BASE_URL + '/users/:id', user.read);

    // Edit account record
    app.put(process.env.BASE_URL + '/users/:id', user.update);

    // Delete account record
    app.delete(process.env.BASE_URL + '/users/:id', user.delete);
};