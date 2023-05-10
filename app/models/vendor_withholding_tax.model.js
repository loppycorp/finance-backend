const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const vendorWithholdingTaxSchema = new mongoose.Schema({
    header: {
        vendor: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'vendor_general_datas' },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        wh_tax_country: { type: String, required: true, trim: true },
    },
    with_tax_information: {
        wth_t_ty: { type: String, required: false, trim: true },
        w_tax_c: { type: String, required: false, trim: true },
        liable: { type: Boolean, required: false },
        rec_ty: { type: String, required: false, trim: true },
        w_tax_id: { type: Number, trim: true, required: false },
        exemption_number: { type: Number, trim: true, required: false },
        exem: { type: String, required: false, trim: true },
        exmpt_r: { type: String, required: false, trim: true },
        exempt_form: { type: Date, required: false },
        exempt_to: { type: Date, required: false },
        description: { type: String, required: false, trim: true },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('vendor_withholding_tax', vendorWithholdingTaxSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

