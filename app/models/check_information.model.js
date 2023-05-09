const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
  check: {
    house_bank: { type: String, trim: true, required: true },
    account_id: { type: String, trim: true, required: true },
    check_number: { type: Number, required: true },
  },
  header: {
    payment_document_no: { type: Number, required: true },
    paying_company_code: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "companies",
    },
    fiscal_year: { type: String, trim: true, required: true },
    payment_date: { type: Date, required: true },
    house_bank: { type: String, trim: true, required: true },
    account_id: { type: String, trim: true, required: true },
    check_number: { type: Number, required: true },
  },
  issuing_amount: {
    currency: { type: String, trim: true, required: true },
    amount_paid: { type: Number, required: true },
    cash_discount_amount: { type: Number, required: false },
  },
  address: {
    title: { type: String, trim: true, required: true },
    payee_name: { type: String, trim: true, required: true },
    street: { type: String, trim: true, required: true },
    city: { type: Boolean, required: true },
    country: { type: String, trim: true, required: true },
    po_box: { type: Number, required: false },
    po_box_post_cde: { type: Number, required: false },
    post_code: { type: Number, required: false },
    regional_code: { type: Number, required: true },
  },

  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("check_information", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
