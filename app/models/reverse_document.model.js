const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const reverseDocuSchema = new mongoose.Schema({
  document_details: {
    document_number: { type: Number, trim: true, required: true },
    company_code: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "companies",
    },
    fiscal_year: { type: Date, default: () => new Date(), required: true },
  },
  specifications: {
    reversal_reason: { type: String, trim: true, required: true },
    posting_date: { type: Date, default: () => new Date(), required: true },
    posting_period: { type: Date, default: () => new Date(), required: false },
  },
  check_management_spec: {
    void_reason_code: { type: String, trim: true, required: false },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("reverse_document", reverseDocuSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
