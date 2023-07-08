const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const chequeLotSchema = new mongoose.Schema({
    header: {
        paying_company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        house_bank: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'house_banks' },
        gl_account: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'gl_accounts' },
    },
    lot: {
        lot: {
            lot_number: { type: Number, required: true },
            cheque_number_from: { type: Number, required: true },
            cheque_number_to: { type: Number, required: true },
        },
        control_data: {
            next_lot_number: { type: Number, required: false },
            pmnt_meths_list: { type: String, trim: true, required: true },
            non_sequential: { type: Boolean, required: false },
        },
        additional_information: {
            short_info: { type: String, trim: true, required: false },
            purchase_date: { type: Date },
        },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('cheque_lot', chequeLotSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

