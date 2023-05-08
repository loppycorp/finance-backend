const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
  header_data: {
    document_date: { type: Date, required: true },
    posting_date: { type: Date, required: true },
    document_number: { type: Number, trim: true, required: false },
    reference: { type: String, trim: true, required: false },
    doc_header_text: { type: String, trim: true, required: false },
    clearing_text: { type: String, trim: true, required: false },
    type: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "document_types",
    },
    period: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "fiscal_periods",
    },
    company_code_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "companies",
    },
    currency_rate: { type: String, trim: true, required: true },
    translatn_date: { type: Date, required: false },
    cross_cc_no: { type: Number, trim: true, required: false },
  },
  transaction_processed: {
    outgoing_payment: { type: Boolean, required: true },
    incoming_payment: { type: Boolean, required: true },
    credit_memo: { type: Boolean, required: true },
    transfer_posting_with_clearing: { type: Boolean, required: true },
  },

  line_item: {
    pstky: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "posting_keys",
    },
    account: { type: String, trim: true, required: true },
    sgl_ind: { type: String, trim: true, required: true },
    ttype: { type: String, trim: true, required: false },
    new_co_code: { type: String, trim: true, required: false },
  },

  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("bill_exchange_payment_header", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
