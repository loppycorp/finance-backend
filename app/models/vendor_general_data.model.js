const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const vendorGeneralDataSchema = new mongoose.Schema({
    header: {
        vendor_code: { type: Number, trim: true, required: false },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        account_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'vendor_account_groups' },
    },
    address: {
        name: {
            title: { type: String, trim: true, required: true },
            name: { type: String, trim: true, required: true },
        },
        search_terms: {
            search_term_1: { type: String, trim: true, required: true },
            search_term_2: { type: String, trim: true, required: false },
        },
        street_address: {
            street: { type: String, trim: true, required: false },
            house_number: { type: Number, trim: true, required: false },
            postal_code: { type: Number, trim: true, required: false },
            city: { type: String, trim: true, required: false },
            country: { type: String, trim: true, required: true },
            region: { type: String, trim: true, required: false },
        },
        po_box_address: {
            po_box: { type: String, trim: true, required: false },
            postal_code: { type: Number, trim: true, required: false },
            company_postal_code: { type: Number, trim: true, required: false },
        },
        communication: {
            language: { type: String, trim: true, required: true },
            telephone: { type: Number, trim: true, required: false },
            mobile_phone: { type: Number, trim: true, required: false },
            fax: { type: Number, trim: true, required: false },
            email: { type: String, trim: true, required: false },
        },
    },
    control_data: {
        account_control: {
            customer: { type: mongoose.SchemaTypes.ObjectId, required: false, default: null, ref: 'customer_general_datas' },
            trading_partner: { type: mongoose.SchemaTypes.ObjectId, required: false, default: null, ref: 'trading_partners' },
            authorization: { type: mongoose.SchemaTypes.ObjectId, required: false, default: null, ref: 'authorizations' },
            corporate_group: { type: mongoose.SchemaTypes.ObjectId, required: false, default: null, ref: 'corporate_groups' },
        },
    },
    payment_transactions: {
        bank_details: [{
            country: { type: String, trim: true, required: false },
            bank_key: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'bank_keys' },
            bank_account: { type: Number, trim: true, required: false },
            account_holder: { type: Number, trim: true, required: false },
            ck: { type: String, trim: true, required: false },
            iban_value: { type: Number, trim: true, required: false },
            bnkt: { type: String, trim: true, required: false },
            reference: { type: String, trim: true, required: false },
        }],
        payment_transactions: {
            alternative_payee: { type: String, trim: true, required: false },
            dme_indicator: { type: Number, trim: true, required: false },
            instruction_key: { type: Number, trim: true, required: false },
            isr_number: { type: Number, trim: true, required: false },

        },
        alternative_payee: {
            individual_spec: { type: Boolean, required: false, default: false },
            spec_reference: { type: Boolean, required: false, default: false },
        },

    },

    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('vendor_general_data', vendorGeneralDataSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

