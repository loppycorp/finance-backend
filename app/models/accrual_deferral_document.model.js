const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
  header: {
    document_date: { type: Date, default: () => new Date(), required: true },
    posting_date: { type: Date, default: () => new Date(), required: true },
    document_number: { type: Number, required: true },
    reference: { type: String, trim: true, required: true },
    doc_header_text: { type: String, trim: true, required: true },
    trading_part_ba: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: true },
    period: { type: Number, required: true },
    ledger_grp_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "ledger_groups",
    },
    company_code_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "companies",
    },
    currency_rate: { type: Number, required: true },
    translatn_date: { type: Date, default: () => new Date(), required: true },
    cross_cc_no: { type: Number, required: true },
  },
  inverse_posting: {
    reversal_reason: { type: String, trim: true, required: true },
    reversal_date: { type: Date, default: () => new Date(), required: true },
  },
  item: {
    pstky: { type: Number, required: true },
    gl_account_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "gl_accounts",
    },
    sgl_ind: { type: String, trim: true, required: true },
    ttype: { type: String, trim: true, required: true },
  },
  data_entry_view: {
    document_number: { type: Number, required: true },
    document_date: { type: Date, default: () => new Date(), required: true },
    reference: { type: String, trim: true, required: true },
    currency: { type: String, trim: true, required: true },
    posting_date: { type: Date, default: () => new Date(), required: true },
    cross_cc_no: { type: Number, required: true },
    fiscal_year: { type: Date, default: () => new Date(), required: true },
    period: { type: Number, required: true },
    ledger_group_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "ledger_groups",
    },
    texts_exist: { type: Boolean, required: true },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("accrual_deferral_document", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
