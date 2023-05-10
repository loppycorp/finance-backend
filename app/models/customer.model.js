const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const customerGeneralDataSchema = new mongoose.Schema({
    header: {
        customer_code: { type: Number, trim: true, required: false },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        account_group: { type: String, trim: true, required: true },
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
            customer: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'customers' },
            trading_partner: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'trading_partners' },
            authorization: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'authorizations' },
            corporate_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'corporate_groups' },
        },
        reference_data: {
            location_one: { type: String, trim: true, required: false },
            location_two: { type: String, trim: true, required: false },
            check_digit: { type: String, trim: true, required: false },
            industry: { type: String, trim: true, required: false },
        },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('customer_general_data', customerGeneralDataSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

