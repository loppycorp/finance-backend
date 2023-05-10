const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const gl_accountSchema = new mongoose.Schema({
  header: {
    gl_account_code: { type: Number, trim: true, required: true },
    company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
  },
  type_description: {
    control_in_chart_of_accounts: {
      account_group: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "account_groups", },
      statement_account: { type: Boolean, required: true },
      balance_sheet_account: { type: Boolean, required: true },
    },
    description: {
      short_text: { type: String, trim: true, required: true },
      long_text: { type: String, trim: true, required: false },
    },
    consoldation_data_in_chart_of_accounts: {
      trading_partner: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "traiding_partners", },
    },
  },
  control_data: {
    account_control_in_company_code: {
      account_currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "currencies", },
      local_crcy: { type: Boolean, required: true },
      exchange_rate: { type: String, trim: true, required: false },
      valuation_group: { type: String, trim: true, required: false },
      tax_category: { type: String, trim: true, required: false },
      posting_tax_allowed: { type: Boolean, required: true },
    },
    account_management_in_company_code: {
      item_mgmt: { type: Boolean, required: true },
      line_item: { type: Boolean, required: true },
      sort_key: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "sort_keys", },
    },
  },
  create_bank_interest: {
    control_of_document_creation_in_company_code: {
      field_status_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "field_status_groups" },
      post_automatically: { type: Boolean, required: true },
    },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("gl_account", gl_accountSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
