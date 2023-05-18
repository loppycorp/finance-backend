const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const reverseAccrualSchema = new mongoose.Schema({
  header: {
    company_code: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "companies",
    },
    company_code_to: { type: String, trim: true, required: false },
    document_number: { type: Number, trim: true, required: false },
    document_number_to: { type: Number, trim: true, required: false },
    fiscal_year: { type: Date, default: () => new Date(), required: false },
    fiscal_year_to: { type: Date, default: () => new Date(), required: false },
    document_type: { type: String, trim: true, required: false },
    document_type_to: { type: String, trim: true, required: false },
    ledger_group: { type: String, trim: true, required: false },
    ledger_group_to: { type: String, trim: true, required: false },
  },
  general_selections: {
    posting_date: { type: Date, default: () => new Date(), required: false },
    posting_date_to: { type: Date, default: () => new Date(), required: false },
    entry_date: { type: Date, default: () => new Date(), required: false },
    entry_date_to: { type: Date, default: () => new Date(), required: false },
    reference: { type: String, trim: true, required: false },
    reference_to: { type: String, trim: true, required: false },
  },
  further_selections: {
    reverse_posting_date: {
      type: Date,
      default: () => new Date(),
      required: false,
    },
    reverse_posting_d_to: {
      type: Date,
      default: () => new Date(),
      required: false,
    },
    user_name: { type: String, trim: true, required: false },
    user_name_to: { type: String, trim: true, required: false },
  },
  reverse_posting_details: {
    posting_period: { type: Date, default: () => new Date(), required: false },
    reversal_reason: { type: String, trim: true, required: false },
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
