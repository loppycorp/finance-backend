const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DOC_TYPE_GL_ACCOUNT = 'GL_ACCOUNT';
const DOC_TYPE_SAMPLE_DOCUMENT = 'SAMPLE_DOCUMENT';
const DOC_TYPE_POST_DOCUMENT = 'POST_DOCUMENT';

const DOC_STATUS_HOLD = "HOLD";
const DOC_STATUS_COMPLETED = "POST";
const DOC_STATUS_PARKED = "PARKED";
const DOC_STATUS_PENDING = "PENDING";
const DOC_STATUS_SIMULATE = "SIMULATE";

const DOC_BALANCED = "BALANCE";
const DOC_UNBALANCED = "UNBALANCE";
const DOC_UNCHECKED = "UNCHECKED";

const TRANS_TYPE_DEBIT = "DEBIT";
const TRANS_TYPE_CREDIT = "CREDIT";

const defaultSchema = new mongoose.Schema({
    header: {
        document_date: { type: Date, required: true },
        document_number: { type: Number, required: false, default: '' },
        // document_number: { type: Number, required: false, default: '', unique: true, sparse: true },
        posting_date: { type: Date, required: true },
        reference: { type: String, required: false, default: '' },
        doc_header_text: { type: String, required: false, default: '' },
        cross_cc_no: { type: String, required: false, default: '' },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' },

        //added from accrual document
        reversal_reason: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'reversal_reasons' },
        reversal_date: { type: Date, required: false, default: '' },
        ledger_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'ledger_groups' },
        type: { type: String, trim: true, required: false, default: '' },
        translatn_date: { type: Date, default: () => new Date(), required: false, default: '' },
        fiscal_year: { type: Date, default: () => new Date(), required: false, default: '' },
        period: { type: Number, required: false, default: '' },
        texts_exist: { type: Boolean, required: false, default: false },


    },
    items: [
        {
            gl_account: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'gl_accounts' },
            short_text: { type: String, required: true },
            transaction_type: { type: String, required: true },
            amount_in_doc_curr: { type: Number, required: true },
            company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
            trading_part_ba: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'trading_partners' },
            bussiness_place: { type: String, required: false, default: '' },
            partner: { type: String, required: false, default: '' },
            cost_center: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'cost_centers' },

            //added from accrual document
            item: { type: Number, required: false, default: '' },
            pk: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "posting_keys", },
            s: { type: String, trim: true, required: false, default: '' },
            description: { type: String, trim: true, required: false, default: '' },
            amount: { type: Number, required: false, default: '' },
            curr: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "currencies" },
            tx: { type: String, trim: true, required: false, default: '' },
            profit_center: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "profit_centers" },
            segment: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "segments" },
        }
    ],
    type: {
        document_code: { type: String, required: false },
        document_status: { type: String, required: false, default: DOC_STATUS_PENDING }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

// defaultSchema.index({ 'header.document_number': 1 }, { unique: true, sparse: true });
module.exports = mongoose.model("document_data", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

module.exports.TRANS_TYPE_DEBIT = TRANS_TYPE_DEBIT;
module.exports.TRANS_TYPE_CREDIT = TRANS_TYPE_CREDIT;

module.exports.DOC_TYPE_GL_ACCOUNT = DOC_TYPE_GL_ACCOUNT;
module.exports.DOC_TYPE_SAMPLE_DOCUMENT = DOC_TYPE_SAMPLE_DOCUMENT;
module.exports.DOC_TYPE_POST_DOCUMENT = DOC_TYPE_POST_DOCUMENT;

module.exports.DOC_STATUS_HOLD = DOC_STATUS_HOLD;
module.exports.DOC_STATUS_COMPLETED = DOC_STATUS_COMPLETED;
module.exports.DOC_STATUS_PARKED = DOC_STATUS_PARKED;
module.exports.DOC_STATUS_PENDING = DOC_STATUS_PENDING;
module.exports.DOC_STATUS_SIMULATE = DOC_STATUS_SIMULATE;

module.exports.DOC_BALANCED = DOC_BALANCED;
module.exports.DOC_UNBALANCED = DOC_UNBALANCED;
module.exports.DOC_UNCHECKED = DOC_UNCHECKED;
