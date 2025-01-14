const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
  header_data: {
    document_date: { type: Date, required: true },
    posting_date: { type: Date, required: true },

    document_number: { type: Number, trim: true, required: false },
    reference: { type: String, trim: true, required: false },
    doc_header_text: { type: String, trim: true, required: false },
    trading_part_ba: { type: String, trim: true, required: false },
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
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("customer_invoice_header", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
