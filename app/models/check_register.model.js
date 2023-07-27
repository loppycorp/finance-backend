const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        paying_company_code: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "companies",
        },
        paying_company_code_to: { type: Number, required: false },
        house_bank: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "house_banks",
        },
        house_bank_to: { type: Number, required: false },
        account_id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "gl_accounts",
        },
        account_id_to: { type: Number, required: false },
        payroll_checks: { type: Boolean, required: false },
    },
    general_selection: {
        general_selection: {
            bank_key: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "bank_keys"
            },
            bank_key_to: { type: String, trim: true, required: false },
            bank_account: { type: Number, required: false },
            bank_account_to: { type: Number, required: false },
            check_number: { type: Number, required: false },
            check_number_to: { type: Number, required: false },
            currency: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "currencies"
            },
            currency_to: { type: Number, required: false },
            amount: { type: Number, required: false },
            amount_to: { type: Number, required: false },
        },
        output_control: {
            list_of_outstanding_checks: { type: Boolean, required: false },
            additional_heading: { type: String, trim: true, required: false },
        },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("check_register", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
