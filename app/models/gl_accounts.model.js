const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DOC_TYPE_GL_ACCOUNT = 'GL';
const DOC_TYPE_SL_ACCOUNT = 'SL';

const gl_accountSchema = new mongoose.Schema({
  header: {
    gl_account_code: { type: Number, trim: true, required: true },
    company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
  },
  type_description: {
    control_in_chart_of_accounts: {
      account_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "account_groups", },
      statement_account: { type: Boolean, required: false },
      balance_sheet_account: { type: Boolean, required: false },
    },
    description: {
      short_text: { type: String, trim: true, required: true },
      long_text: { type: String, trim: true, required: false },
    },
    consolidation_data_in_chart_of_accounts: {
      trading_partner: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "trading_partners", },
    },
  },
  control_data: {
    account_control_in_company_code: {
      account_currency: { type: mongoose.SchemaTypes.ObjectId, required: false, default: null, ref: "currencies", },
      local_crcy: { type: Boolean, required: false, default: false },
      exchange_rate: { type: String, trim: true, required: false, default: '' },
      valuation_group: { type: String, trim: true, required: false, default: '' },
      tax_category: { type: String, trim: true, required: false, default: '' },
      posting_tax_allowed: { type: Boolean, required: false, default: false },
    },
    account_management_in_company_code: {
      item_mgmt: { type: Boolean, required: false, default: false },
      line_item: { type: Boolean, required: false, default: false },
      sort_key: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "sort_keys", },
    },
  },
  create_bank_interest: {
    control_of_document_creation_in_company_code: {
      field_status_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "field_status_groups" },
      post_automatically: { type: Boolean, required: false, default: false },
    },
  },
  type: {
    account_type: { type: String, trim: true, required: false },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
  created_by: { type: String, required: true },
  updated_by: { type: String, required: true },
});

module.exports = mongoose.model("gl_account", gl_accountSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

module.exports.DOC_TYPE_GL_ACCOUNT = DOC_TYPE_GL_ACCOUNT;
module.exports.DOC_TYPE_SL_ACCOUNT = DOC_TYPE_SL_ACCOUNT;



