const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DOC_TYPE_GL_ACCOUNT = 'GL_ACCOUNT';
const DOC_TYPE_SAMPLE_DOCUMENT = 'SAMPLE_DOCUMENT';
const DOC_TYPE_POST_DOCUMENT = 'POST_DOCUMENT';

const TRANS_TYPE_DEBIT = "DEBIT";
const TRANS_TYPE_CREDIT = "CREDIT";

const defaultSchema = new mongoose.Schema({
    code: { type: String, required: true, default: DOC_TYPE_GL_ACCOUNT },
    header: {
        document_date: { type: Date, required: true },
        posting_date: { type: Date, required: true },
        reference: { type: String, required: false, default: '' },
        doc_header_text: { type: String, required: false, default: '' },
        cross_cc_no: { type: String, required: false, default: '' },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' }
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
            cost_center: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'cost_centers' }
        }
    ],
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("document_data", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

module.exports.TRANS_TYPE_DEBIT = TRANS_TYPE_DEBIT;
module.exports.TRANS_TYPE_CREDIT = TRANS_TYPE_CREDIT;

module.exports.DOC_TYPE_GL_ACCOUNT = DOC_TYPE_GL_ACCOUNT;
module.exports.DOC_TYPE_SAMPLE_DOCUMENT = DOC_TYPE_SAMPLE_DOCUMENT;
module.exports.DOC_TYPE_POST_DOCUMENT = DOC_TYPE_POST_DOCUMENT;