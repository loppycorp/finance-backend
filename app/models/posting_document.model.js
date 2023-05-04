const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
  header: {
    company_code_id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false,
      ref: "companies",
    },
    company_code_to: { type: String, trim: true, required: true },
    document_number: { type: Number, required: true },
    document_number_to: { type: Number, required: true },
    fiscal_year: { type: Date, default: () => new Date(), required: true },
    fiscal_year_to: { type: Date, default: () => new Date(), required: true },
  },
  general_selections: {
    document_type: { type: String, trim: true, required: true },
    document_type_to: { type: String, trim: true, required: true },
    posting_date: { type: Date, default: () => new Date(), required: true },
    posting_date_to: { type: Date, default: () => new Date(), required: true },
    entry_date: { type: Date, default: () => new Date(), required: true },
    entry_date_to: { type: Date, default: () => new Date(), required: true },
    reference_number: { type: Number, required: true },
    reference_number_to: { type: Number, required: true },
    reference_transaction: { type: String, trim: true, required: true },
    reference_transaction_to: { type: String, trim: true, required: true },
    reference_key: { type: String, trim: true, required: true },
    reference_key_to: { type: String, trim: true, required: true },
    logical_system: { type: String, trim: true, required: true },
    logical_system_to: { type: String, trim: true, required: true },
  },
  further_selection: {
    settlement_period: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    settlement_period_to: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    run_schedule: { type: Date, default: () => new Date(), required: true },
    run_schedule_to: { type: Date, default: () => new Date(), required: true },
    user: { type: String, trim: true, required: true },
    user_to: { type: String, trim: true, required: true },
  },
  output_control: {
    batch_input_session_name: { type: String, trim: true, required: true },
    user_name: { type: String, trim: true, required: true },
    blocking_date: { type: Date, default: () => new Date(), required: true },
    hold_processed_session: { type: Boolean, required: true },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("posting_document", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
