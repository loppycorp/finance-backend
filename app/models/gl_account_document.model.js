const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
  basic_data: {
    document_date: { type: Date, default: () => new Date(), required: true },
    posting_date: { type: Date, default: () => new Date(), required: true },
    reference: { type: String, trim: true, required: true },
    doc_header_text: { type: String, trim: true, required: true },
    cross_cc_no: { type: Number, required: true },
    company_code_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "companies",
    },
    currency: { type: String, trim: true, required: true },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("gl_account_document", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
