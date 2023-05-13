const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const vendorWithholdingTaxSchema = new mongoose.Schema({
    header: {
        vendor: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "vendor_general_datas" },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "companies" },
        gl_account: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "gl_accounts" },
    },
    item: {
        title: { type: String, required: false },
        name: { type: String, required: false },
        language_key: { type: String, required: false },
        street: { type: String, required: false },
        po_box: { type: String, required: false },
        po_without_no: { type: Boolean, required: false },
        po_box_pcode: { type: String, required: false },
        city: { type: String, required: false },
        country: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "countries" },
        postal_code: { type: String, required: false },
        region: { type: String, required: false },
        bank_key: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "bank_keys" },
        bank_account: { type: String, required: false },
        reference: { type: String, required: false },
        back_country: { type: String, required: true },
        control_key: { type: String, required: false },
        instruction_key: { type: String, required: false },
        dme_indicator: { type: String, required: false },
        tax_type: { type: String, required: false },
        tax_number_type: { type: String, required: false },
        tax_number1: { type: Number, required: false },
        tax_number2: { type: Number, required: false },
        tax_number3: { type: Number, required: false },
        tax_number4: { type: Number, required: false },
        type_of_business: { type: String, required: false },
        type_of_industr: { type: String, required: false },
        natural_person: { type: Boolean, required: false },
        equalizatn_tax: { type: Boolean, required: false },
        liable_for_vat: { type: Boolean, required: false },
        reps_name: { type: String, required: false },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('vendor_invoice', vendorWithholdingTaxSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

