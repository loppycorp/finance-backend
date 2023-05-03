const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const reverseAccrualSchema = new mongoose.Schema({
  company_code_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "companies",
  },
  company_code_id_to: { type: String, trim: true, required: true },
  document_number: { type: Number, trim: true, required: true },
  document_number_to: { type: Number, trim: true, required: true },
  fiscal_year: { type: Date, default: () => new Date(), required: true },
  fiscal_year_to: { type: Date, default: () => new Date(), required: true },
  document_type: { type: String, trim: true, required: true },
  document_type_to: { type: String, trim: true, required: true },
  ledger_group: { type: String, trim: true, required: true },
  ledger_group_to: { type: String, trim: true, required: true },
  general_selections: {
    posting_date: { type: Date, default: () => new Date(), required: true },
    posting_date_to: { type: Date, default: () => new Date(), required: true },
    entry_date: { type: Date, default: () => new Date(), required: true },
    entry_date_to: { type: Date, default: () => new Date(), required: true },
    reference: { type: String, trim: true, required: true },
    reference_to: { type: String, trim: true, required: true },
  },
  further_selections: {
    reverse_posting_date: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    reverse_posting_d_to: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    user_name: { type: String, trim: true, required: true },
    user_name_to: { type: String, trim: true, required: true },
  },
  reverse_posting_details: {
    posting_period: { type: Date, default: () => new Date(), required: true },
    reversal_reason: { type: String, trim: true, required: true },
    test_run: { type: Boolean, required: true },
  },
  cross_company_code_transactions: {
    do_not_process: { type: Boolean, required: true },
    process: { type: Boolean, required: true },
    relevant_docs_if_possible: { type: Boolean, required: true },
    only_reverse_completely: { type: Boolean, required: true },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model(
  "reverse_accrual_document",
  reverseAccrualSchema
);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
