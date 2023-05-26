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
const bank_group = require('../controllers/bank_group.controller');
const reversal = require('../controllers/code_reversal_reason.controller');

const code_plant = require('../controllers/code_plant.controller');
const code_stor_location = require('../controllers/code_stor_location.controller');
const code_material_group = require('../controllers/code_material_group.controller');
const code_purchasing_group = require('../controllers/code_purchasing_group.controller');
const code_material_type = require('../controllers/code_material_type.controller');
const code_meature = require('../controllers/code_meature.controller');
const code_industry_sector = require('../controllers/code_industry_sector.controller');


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

    //bank group
    app.post(process.env.BASE_URL + '/bank-groups', auth.validateToken, bank_group.create);
    app.get(process.env.BASE_URL + '/bank-groups', auth.validateToken, pagination.setAttributes, bank_group.search);
    app.get(process.env.BASE_URL + '/bank-groups/:id', auth.validateToken, bank_group.read);
    app.put(process.env.BASE_URL + '/bank-groups/:id', auth.validateToken, bank_group.update);
    app.delete(process.env.BASE_URL + '/bank-groups/:id', auth.validateToken, bank_group.delete);
    //reversal reason
    app.post(process.env.BASE_URL + '/reversal-reason', auth.validateToken, reversal.create);
    app.get(process.env.BASE_URL + '/reversal-reason', auth.validateToken, pagination.setAttributes, reversal.search);
    app.get(process.env.BASE_URL + '/reversal-reason/:id', auth.validateToken, reversal.read);
    app.put(process.env.BASE_URL + '/reversal-reason/:id', auth.validateToken, reversal.update);
    app.delete(process.env.BASE_URL + '/reversal-reason/:id', auth.validateToken, reversal.delete);
    ////////////////////////
    //code_plant 
    app.post(process.env.BASE_URL + '/code-plant', auth.validateToken, code_plant.create);
    app.get(process.env.BASE_URL + '/code-plant', auth.validateToken, pagination.setAttributes, code_plant.search);
    app.get(process.env.BASE_URL + '/code-plant/:id', auth.validateToken, code_plant.read);
    app.put(process.env.BASE_URL + '/code-plant/:id', auth.validateToken, code_plant.update);
    app.delete(process.env.BASE_URL + '/code-plant/:id', auth.validateToken, code_plant.delete);
    //code_stor_location
    app.post(process.env.BASE_URL + '/code-stor-location', auth.validateToken, code_stor_location.create);
    app.get(process.env.BASE_URL + '/code-stor-location', auth.validateToken, pagination.setAttributes, code_stor_location.search);
    app.get(process.env.BASE_URL + '/code-stor-location/:id', auth.validateToken, code_stor_location.read);
    app.put(process.env.BASE_URL + '/code-stor-location/:id', auth.validateToken, code_stor_location.update);
    app.delete(process.env.BASE_URL + '/code-stor-location/:id', auth.validateToken, code_stor_location.delete);
    //code-material-group
    app.post(process.env.BASE_URL + '/code-material-group', auth.validateToken, code_material_group.create);
    app.get(process.env.BASE_URL + '/code-material-group', auth.validateToken, pagination.setAttributes, code_material_group.search);
    app.get(process.env.BASE_URL + '/code-material-group/:id', auth.validateToken, code_material_group.read);
    app.put(process.env.BASE_URL + '/code-material-group/:id', auth.validateToken, code_material_group.update);
    app.delete(process.env.BASE_URL + '/code-material-group/:id', auth.validateToken, code_material_group.delete);
    //code_purchasing_group
    app.post(process.env.BASE_URL + '/code-purchasing-group', auth.validateToken, code_purchasing_group.create);
    app.get(process.env.BASE_URL + '/code-purchasing-group', auth.validateToken, pagination.setAttributes, code_purchasing_group.search);
    app.get(process.env.BASE_URL + '/code-purchasing-group/:id', auth.validateToken, code_purchasing_group.read);
    app.put(process.env.BASE_URL + '/code-purchasing-group/:id', auth.validateToken, code_purchasing_group.update);
    app.delete(process.env.BASE_URL + '/code-purchasing-group/:id', auth.validateToken, code_purchasing_group.delete);
    //code_material_type
    app.post(process.env.BASE_URL + '/code-material-type', auth.validateToken, code_material_type.create);
    app.get(process.env.BASE_URL + '/code-material-type', auth.validateToken, pagination.setAttributes, code_material_type.search);
    app.get(process.env.BASE_URL + '/code-material-type/:id', auth.validateToken, code_material_type.read);
    app.put(process.env.BASE_URL + '/code-material-type/:id', auth.validateToken, code_material_type.update);
    app.delete(process.env.BASE_URL + '/code-material-type/:id', auth.validateToken, code_material_type.delete);
    //code_meature
    app.post(process.env.BASE_URL + '/code-measure', auth.validateToken, code_meature.create);
    app.get(process.env.BASE_URL + '/code-measure', auth.validateToken, pagination.setAttributes, code_meature.search);
    app.get(process.env.BASE_URL + '/code-measure/:id', auth.validateToken, code_meature.read);
    app.put(process.env.BASE_URL + '/code-measure/:id', auth.validateToken, code_meature.update);
    app.delete(process.env.BASE_URL + '/code-measure/:id', auth.validateToken, code_meature.delete);
    //Industry Sector
    app.post(process.env.BASE_URL + '/code-industry-sector', auth.validateToken, code_industry_sector.create);
    app.get(process.env.BASE_URL + '/code-industry-sector', auth.validateToken, pagination.setAttributes, code_industry_sector.search);
    app.get(process.env.BASE_URL + '/code-industry-sector/:id', auth.validateToken, code_industry_sector.read);
    app.put(process.env.BASE_URL + '/code-industry-sector/:id', auth.validateToken, code_industry_sector.update);
    app.delete(process.env.BASE_URL + '/code-industry-sector/:id', auth.validateToken, code_industry_sector.delete);
}