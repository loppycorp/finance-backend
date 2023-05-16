const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        document_date: { type: Date, default: () => new Date(), required: true },
        posting_date: { type: Date, default: () => new Date(), required: true },
        document_number: { type: Number, required: false },
        reference: { type: String, trim: true, required: false },
        doc_header_text: { type: String, trim: true, required: true },
        clearing_text: { type: String, trim: true, required: true },
        trading_part_ba: { type: String, trim: true, required: false },
        type: { type: String, trim: true, required: true },
        period: { type: Number, required: true },
        company_code: {
            type: mongoose.SchemaTypes.ObjectId, required: false, ref: "companies",
        },
        currency_rate: { type: Number, required: true },
        translatn_date: { type: Date, default: () => new Date(), required: false },
        cross_cc_no: { type: Number, required: false },
    },
    bank_data: {
        account: { type: Number, required: true },
        amount: { type: Number, required: true },
        bank_charges: { type: String, trim: true, required: false },
        value_date: { type: Date, default: () => new Date(), required: true },
        text: { type: String, trim: true, required: true },
        business_area: { type: String, trim: true, required: false },
        amount_lc: { type: String, trim: true, required: true },
        lc_bank_charges: { type: String, trim: true, required: false },
        profit_center: {
            type: mongoose.SchemaTypes.ObjectId, required: false, ref: "profit_centers",
        },
        assignment: { type: Number, required: true },
    },
    open_item_selection: {
        account: { type: String, trim: true, required: true },
        account_type: { type: String, trim: true, required: true },
        special_gl: { type: String, trim: true, required: false },
        pmnt_advice_no: { type: String, trim: true, required: true },
        distribute_by_age: { type: Boolean, required: false },
        automatic_search: { type: Boolean, required: false },
        other_accounts: { type: Boolean, required: false },
        standard_ols: { type: Boolean, required: false },
    },
    additional_selections: {
        none: { type: Boolean, required: false },
        amount: { type: Boolean, required: false },
        number: { type: Boolean, required: false },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("incoming_payment", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
