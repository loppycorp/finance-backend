require('dotenv').config();
const vendor = require('../controllers/vendor_pymnt_transc.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new account record
    app.post(process.env.BASE_URL + '/vendor-pymnt-transc', vendor.create);

    // List available account records
    app.get(process.env.BASE_URL + '/vendor-pymnt-transc', pagination.setAttributes, vendor.search);

    // View account record
    app.get(process.env.BASE_URL + '/vendor-pymnt-transc/:id', vendor.read);

    // Edit account record
    app.put(process.env.BASE_URL + '/vendor-pymnt-transc/:id', vendor.update);

    // Delete account record
    app.delete(process.env.BASE_URL + '/vendor-pymnt-transc/:id', vendor.delete);
};