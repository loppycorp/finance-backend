const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DOC_TYPE_VENDOR = 'VENDOR';
const DOC_TYPE_CUSTOMER = 'CUSTOMER';



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
        vendor: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'vendor_general_datas' },
        document_number: { type: Number, required: false, default: '' },
        invoice_date: { type: Date, required: true },
        posting_date: { type: Date, required: true },
        document_type: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'document_types' },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        cross_cc_no: { type: String, required: false},
        amount: { type: Number, required: true},
        tax_amount: { type: Number, required: false},
        business_place: { type: Number, required: false},
        section: { type: Number, required: false},
        text: { type: String, required: false},
        sgl_ind: { type: String, required: false},
        reference: { type: String, required: false},
        currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' },
        calculate_tax: {type: Boolean, required:false}

    },
    items: {
        items: [
            {
                gl_account: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'gl_accounts' },
                transaction_type: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "posting_keys", },
                amount: { type: Number, required: true },
                trading_part_ba: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'trading_partners' },
                segment: { type: mongoose.SchemaTypes.ObjectId, required: false, default: null, ref: "segments" },
                cost_center: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'cost_centers' },
                tax: { type: String, trim: true, required: false, default: '' },
            
            }
        ],
    },
    type: {
        invoice_code: { type: String, required: false },
        invoice_status: { type: String, required: false, default: DOC_STATUS_PENDING }
    },
    amount_information: {
        total_credit: { type: Number, required: false },
        total_debit: { type: Number, required: false },
        balance_status: { type: String, required: false, default: DOC_UNCHECKED }
    },

    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
    created_by: { type: String, required: true },
    updated_by: { type: String, required: true },
});

// defaultSchema.index({ 'header.document_number': 1 }, { unique: true, sparse: true });
module.exports = mongoose.model("invoice", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

module.exports.TRANS_TYPE_DEBIT = TRANS_TYPE_DEBIT;
module.exports.TRANS_TYPE_CREDIT = TRANS_TYPE_CREDIT;

module.exports.DOC_TYPE_VENDOR= DOC_TYPE_VENDOR;
module.exports.DOC_TYPE_CUSTOMER = DOC_TYPE_CUSTOMER;


module.exports.DOC_STATUS_HOLD = DOC_STATUS_HOLD;
module.exports.DOC_STATUS_COMPLETED = DOC_STATUS_COMPLETED;
module.exports.DOC_STATUS_PARKED = DOC_STATUS_PARKED;
module.exports.DOC_STATUS_PENDING = DOC_STATUS_PENDING;
module.exports.DOC_STATUS_SIMULATE = DOC_STATUS_SIMULATE;

module.exports.DOC_BALANCED = DOC_BALANCED;
module.exports.DOC_UNBALANCED = DOC_UNBALANCED;
module.exports.DOC_UNCHECKED = DOC_UNCHECKED;
