const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        document_number: { type: Number, required: false },
        document_date: { type: Date, default: () => new Date(), required: false },
        reference: { type: String, trim: true, required: false },
        currency: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "currencies" },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "companies" },
        posting_date: { type: Date, default: () => new Date(), required: false },
        cross_cc_no: { type: Number, required: false },
        fiscal_year: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "fiscal_period" },
        period: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "fiscal_period" },
        ledger_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "ledger_groups" },
    },
    item: {
        item: [{
            company_code: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "companies" },
            posting_key: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "posting_keys" },
            s: { type: String, trim: true, required: false },
            account: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "gl_accounts" },
            description: { type: String, trim: true, required: false },
            amount: { type: Number, required: false },
            currency: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "currencies" },
            tax: { type: Number, required: false },
            cost_center: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "cost_centers" },
            profit_center: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "profit_centers" },
            segment: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "segments" },
        }],
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("goods_issue", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
