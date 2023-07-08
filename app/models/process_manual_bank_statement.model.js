const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const processManualCtrGrpSchema = new mongoose.Schema({
    header: {
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "companies" },
        house_bank: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "house_banks" },
        account_id: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "gl_accounts" },
        statement_number: { type: Number },
        statement_date: { type: Date },
        currency: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: "currencies" },
    },
    control: {
        control: {
            opening_balance: { type: Number },
            closing_balance: { type: Number },
            posting_date: { type: Date },
        },
        selection_of_payment_advices: {
            planning_type: { type: String, trim: true },
            statement_date: { type: Date },
            planning_date_from: { type: Date },
            planning_date_to: { type: Date },
            characteristic: { type: String, trim: true },
        },
        further_processing: {
            bank_posting_only: { type: Boolean },
        },
    },


    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('process_manual_bank_statement', processManualCtrGrpSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;