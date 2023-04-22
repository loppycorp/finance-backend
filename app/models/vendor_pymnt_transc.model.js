const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const vendorPaymentTransactionsSchema = new mongoose.Schema({
    vendor_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'vendors' },
    vendor_code: {  type: Number, trim: true, required: true},
    bank_details: {
        country: { type: String, trim: true, required: true },
        bank_key: {  type: Number, trim: true, required: false},
        bank_account: {  type: Number, trim: true, required: false},
        account_holder: {  type: Number, trim: true, required: false},
        ck: { type: String, trim: true, required: true },
        iban_value: {  type: Number, trim: true, required: false},
        bnkt: { type: String, trim: true, required: true },
        reference: { type: String, trim: true, required: true },

    },
    payment_transactions: {
        alternative_payee: { type: String, trim: true, required: true },
        dme_indicator: {  type: Number, trim: true, required: false},
        instruction_key: {  type: Number, trim: true, required: false},
        isr_number: {  type: Number, trim: true, required: false},

    },
    alternative_payee: {
        individual_spec: { type: Boolean, required: false },
        spec_reference: { type: Boolean, required: false},
    },
    
    status:  { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date,  default: () => new Date(), required: true }
});

module.exports = mongoose.model('vendor_pymnt_transac', vendorPaymentTransactionsSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

