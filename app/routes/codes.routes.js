require('dotenv').config();
const code_cash_mgmnt_group = require('../controllers/code_cash_mgmnt_group.controller');
const code_release_group = require('../controllers/code_release_group.controller');
const code_tolerance_group = require('../controllers/code_tolerance_group.controller');
const code_country = require('../controllers/code_country.controller');
const code_field_status_group = require('../controllers/code_field_status_group.controller');
const code_authorization = require('../controllers/code_authorization.controller');
const code_corporate_group = require('../controllers/code_corporate_group.controller');
const code_buying_group = require('../controllers/code_buying_group.controller');
const code_ledger_group = require('../controllers/code_ledger_group.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    //code_cash_mgmnt_group
    app.post(process.env.BASE_URL + '/code-cash-mgmnt-group', auth.validateToken, code_cash_mgmnt_group.create);
    app.get(process.env.BASE_URL + '/code-cash-mgmnt-group', auth.validateToken, pagination.setAttributes, code_cash_mgmnt_group.search);
    app.get(process.env.BASE_URL + '/code-cash-mgmnt-group/:id', auth.validateToken, code_cash_mgmnt_group.read);
    app.put(process.env.BASE_URL + '/code-cash-mgmnt-group/:id', auth.validateToken, code_cash_mgmnt_group.update);
    app.delete(process.env.BASE_URL + '/code-cash-mgmnt-group/:id', auth.validateToken, code_cash_mgmnt_group.delete);
    //code_release_group
    app.post(process.env.BASE_URL + '/code-release-group', auth.validateToken, code_release_group.create);
    app.get(process.env.BASE_URL + '/code-release-group', auth.validateToken, pagination.setAttributes, code_release_group.search);
    app.get(process.env.BASE_URL + '/code-release-group/:id', auth.validateToken, code_release_group.read);
    app.put(process.env.BASE_URL + '/code-release-group/:id', auth.validateToken, code_release_group.update);
    app.delete(process.env.BASE_URL + '/code-release-group/:id', auth.validateToken, code_release_group.delete);
    //code_tolerance_group
    app.post(process.env.BASE_URL + '/code-tolerance-group', auth.validateToken, code_tolerance_group.create);
    app.get(process.env.BASE_URL + '/code-tolerance-group', auth.validateToken, pagination.setAttributes, code_tolerance_group.search);
    app.get(process.env.BASE_URL + '/code-tolerance-group/:id', auth.validateToken, code_tolerance_group.read);
    app.put(process.env.BASE_URL + '/code-tolerance-group/:id', auth.validateToken, code_tolerance_group.update);
    app.delete(process.env.BASE_URL + '/code-tolerance-group/:id', auth.validateToken, code_tolerance_group.delete);
    //code_country
    app.post(process.env.BASE_URL + '/code-country', auth.validateToken, code_country.create);
    app.get(process.env.BASE_URL + '/code-country', auth.validateToken, pagination.setAttributes, code_country.search);
    app.get(process.env.BASE_URL + '/code-country/:id', auth.validateToken, code_country.read);
    app.put(process.env.BASE_URL + '/code-country/:id', auth.validateToken, code_country.update);
    app.delete(process.env.BASE_URL + '/code-country/:id', auth.validateToken, code_country.delete);
    //code_field_status_group
    app.post(process.env.BASE_URL + '/code-field-status-group', auth.validateToken, code_field_status_group.create);
    app.get(process.env.BASE_URL + '/code-field-status-group', auth.validateToken, pagination.setAttributes, code_field_status_group.search);
    app.get(process.env.BASE_URL + '/code-field-status-group/:id', auth.validateToken, code_field_status_group.read);
    app.put(process.env.BASE_URL + '/code-field-status-group/:id', auth.validateToken, code_field_status_group.update);
    app.delete(process.env.BASE_URL + '/code-field-status-group/:id', auth.validateToken, code_field_status_group.delete);
    //code_authorization
    app.post(process.env.BASE_URL + '/code-authorization', auth.validateToken, code_authorization.create);
    app.get(process.env.BASE_URL + '/code-authorization', auth.validateToken, pagination.setAttributes, code_authorization.search);
    app.get(process.env.BASE_URL + '/code-authorization/:id', auth.validateToken, code_authorization.read);
    app.put(process.env.BASE_URL + '/code-authorization/:id', auth.validateToken, code_authorization.update);
    app.delete(process.env.BASE_URL + '/code-authorization/:id', auth.validateToken, code_authorization.delete);
    //code_corporate_group
    app.post(process.env.BASE_URL + '/code-corporate-group', auth.validateToken, code_corporate_group.create);
    app.get(process.env.BASE_URL + '/code-corporate-group', auth.validateToken, pagination.setAttributes, code_corporate_group.search);
    app.get(process.env.BASE_URL + '/code-corporate-group/:id', auth.validateToken, code_corporate_group.read);
    app.put(process.env.BASE_URL + '/code-corporate-group/:id', auth.validateToken, code_corporate_group.update);
    app.delete(process.env.BASE_URL + '/code-corporate-group/:id', auth.validateToken, code_corporate_group.delete);
    //code_buying_group
    app.post(process.env.BASE_URL + '/code-buying-group', auth.validateToken, code_buying_group.create);
    app.get(process.env.BASE_URL + '/code-buying-group', auth.validateToken, pagination.setAttributes, code_buying_group.search);
    app.get(process.env.BASE_URL + '/code-buying-group/:id', auth.validateToken, code_buying_group.read);
    app.put(process.env.BASE_URL + '/code-buying-group/:id', auth.validateToken, code_buying_group.update);
    app.delete(process.env.BASE_URL + '/code-buying-group/:id', auth.validateToken, code_buying_group.delete);
    //code_ledger_group
    app.post(process.env.BASE_URL + '/code-ledger-group', auth.validateToken, code_ledger_group.create);
    app.get(process.env.BASE_URL + '/code-ledger-group', auth.validateToken, pagination.setAttributes, code_ledger_group.search);
    app.get(process.env.BASE_URL + '/code-ledger-group/:id', auth.validateToken, code_ledger_group.read);
    app.put(process.env.BASE_URL + '/code-ledger-group/:id', auth.validateToken, code_ledger_group.update);
    app.delete(process.env.BASE_URL + '/code-ledger-group/:id', auth.validateToken, code_ledger_group.delete);

}