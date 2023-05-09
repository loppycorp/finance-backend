const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    document_date: { type: Date, required: true },
    type: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'document_types' },
    company: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },

    posting_date: { type: Date, required: true },
    period: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'fiscal_period' },
    currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' },
    currency_rate: { type: Number, required: false },

    doc_number: { type: String, required: false },
    translatn_date: { type: Date, required: false },
    reference: { type: String, required: false },
    cross_cc_no: { type: String, required: false },

    doc_header_text: { type: String, required: true },
    trading_part_ba: { type: String, required: false },

    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("gl_account_document_header", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
