const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
  header_data: {
    document_date: { type: Date, default: () => new Date(), required: true },
    posting_date: { type: Date, default: () => new Date(), required: true },
    document_number: { type: Number, trim: true, required: true },
    reference: { type: String, trim: true, required: true },
    doc_header_text: { type: String, trim: true, required: true },
    trading_part_ba: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: true },
    period: { type: String, trim: true, required: true },
    company_code_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "companies",
    },
    currency_rate: { type: String, trim: true, required: true },
    translatn_date: { type: Date, default: () => new Date(), required: true },
    cross_cc_no: { type: Number, trim: true, required: true },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("gl_account_header", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
