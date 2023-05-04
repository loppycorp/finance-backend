const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
  reference: {
    document_number: { type: Number, required: true },
    company_code_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "companies",
    },
    fiscal_year: { type: Date, default: () => new Date(), required: true },
  },
  flow_control: {
    generate_reverse: { type: Boolean, required: true },
    enter_gl_acc_itm: { type: Boolean, required: true },
    do_not_propose_amounts: { type: Boolean, required: true },
    recalculate_days: { type: Boolean, required: true },
    display: { type: Boolean, required: true },
    copy_text: { type: Boolean, required: true },
    transfer: { type: Boolean, required: true },
    recalculate_local: { type: Boolean, required: true },
    copy_segment: { type: Boolean, required: true },
  },
  header: {
    document_date: { type: Date, default: () => new Date(), required: true },
    posting_date: { type: Date, default: () => new Date(), required: true },
    document_number: { type: Number, required: true },
    reference: { type: String, trim: true, required: true },
    doc_header_text: { type: String, trim: true, required: true },
    trading_part_ba: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: true },
    period: { type: Number, required: true },
    company_code_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "companies",
    },
    currency_rate: { type: Number, required: true },
    translatn_date: { type: Date, default: () => new Date(), required: true },
    cross_cc_no: { type: Number, required: true },
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

  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("post_document_header", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
