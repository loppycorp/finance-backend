require('dotenv').config();
const vendor = require('../controllers/vendor_general_data.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new account record
    app.post(process.env.BASE_URL + '/vendors', vendor.create);

    // List available account records
    app.get(process.env.BASE_URL + '/vendors', pagination.setAttributes, vendor.search);

    // View account record
    app.get(process.env.BASE_URL + '/vendors/:id', vendor.get);

    // Edit account record
    app.put(process.env.BASE_URL + '/vendors/:id', vendor.update);

    // Delete account record
    app.delete(process.env.BASE_URL + '/vendors/:id', vendor.delete);
};