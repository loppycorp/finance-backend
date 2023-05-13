require('dotenv').config();
const defaultController = require('../controllers/vendor_invoice.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
  // Create new account record
  app.post(process.env.BASE_URL + '/vendor-invoice', auth.validateToken, defaultController.create);

  // List available account records
  app.get(process.env.BASE_URL + '/vendor-invoice', auth.validateToken, pagination.setAttributes, defaultController.search);

  // View account record
  app.get(process.env.BASE_URL + '/vendor-invoice/:id', auth.validateToken, defaultController.get);

  // Edit account record
  app.put(process.env.BASE_URL + '/vendor-invoice/:id', auth.validateToken, defaultController.update);

  // Delete account record
  app.delete(process.env.BASE_URL + '/vendor-invoice/:id', auth.validateToken, defaultController.delete);
};