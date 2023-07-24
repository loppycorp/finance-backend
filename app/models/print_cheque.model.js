const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({

    header: {
        document_number: { type: Number, required: true },
        company_code: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "companies",
        },
        fiscal_year: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "fiscal_periods",
        },
    },
    items: {
        payment_method_and_form_specifications: {
            payment_method: { type: String, trim: true, required: false },
            check_lot_number: { type: Number, required: false },
            alternative_form: { type: String, trim: true, required: false },
            padding_character: { type: String, trim: true, required: false },
        },
        output_control: {
            printer_for_forms: { type: String, trim: true, required: false },
            pmnt_advice_printer: { type: String, trim: true, required: false },
            print_immediately: { type: Boolean, required: false },
            recipients_lang: { type: Boolean, required: false },
            currency_in_iso_code: { type: Boolean, required: false },
            test_printout: { type: Boolean, required: false },
            do_not_void_any_checks: { type: Boolean, required: false },
        }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("print_cheque", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
