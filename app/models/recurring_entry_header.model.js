const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
  company_code_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "companies",
  },
  recurring_entry_run: {
    first_run_on: { type: Date, default: () => new Date(), required: true },
    last_run_on: { type: Date, default: () => new Date(), required: true },
    interval_in_months: { type: Number, trim: true, required: true },
    run_date: { type: Date, default: () => new Date(), required: true },
    run_schedule: { type: Date, default: () => new Date(), required: true },
    transfer_amounts: { type: Boolean, required: true },
    transfer_tax_amouns: { type: Boolean, required: true },
  },
  document_header_information: {
    document_type: { type: String, trim: true, required: true },
    reference: { type: String, trim: true, required: true },
    document_header_text: { type: String, trim: true, required: true },
    trading_part_ba: { type: String, trim: true, required: true },
    currency_rate: { type: String, trim: true, required: true },
    translatn_date: { type: Date, default: () => new Date(), required: true },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("recurring_entry_header", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
