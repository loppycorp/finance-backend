const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    header: {
        document_number: { type: Number, required: true },
        document_date: { type: Date, required: true },
        reference: { type: String, required: false },
        currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        posting_date: { type: Date, required: true },
        cross_cc_no: { type: String, required: false },
        fiscal_year: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'fiscal_periods' },
        ledger: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'ledger_groups' },
    },
    items: {
        items: [
            {
                company: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
                pk: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "posting_keys", },
                account: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'gl_accounts' },
                amount: { type: Number, required: true },
                currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' },
                tax: { type: String, trim: true, required: false, default: '' },
                profit_center: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'profit_centers' },
                segment: { type: mongoose.SchemaTypes.ObjectId, required: false, default: null, ref: "segments" },
            }
        ],
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("material_document", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
