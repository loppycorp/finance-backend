const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        vendor_account: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "vendor_general_datas",
        },
        vendor_account_to: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "vendor_general_datas",
        },
        company_code: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "companies",
        },
        company_code_to: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "companies",
        },
    },
    window_1: {
        further_selections: {
            calculation_period: { type: String, trim: true, required: false },
            calculation_period_to: { type: String, trim: true, required: false },
            bill_of_exchange_pmnt_possible: { type: String, trim: true, required: false },
            bill_exh_pmnt_document_typ: { type: String, trim: true, required: false },
            bill_exh_pmnt_document_typ_to: { type: String, trim: true, required: false },
            interest_indicator: { type: String, trim: true, required: false },
            interest_indicator_to: { type: String, trim: true, required: false },
            reconcilation_account: { type: String, trim: true, required: false },
            reconcilation_account_to: { type: String, trim: true, required: false },
            sp_gl_ind_to_be_selected: { type: String, trim: true, required: false },
            sp_gl_ind_to_be_selected_to: { type: String, trim: true, required: false },
        }
    },
    window_2: {
        output_control: {
            create_form: { type: Boolean, required: false },
            form_name: { type: String, trim: true, required: false },
            print_form: { type: Boolean, required: false },
            form_printer_batch: { type: String, trim: true, required: false },
            date_of_issue: { type: Date, default: () => new Date(), required: false },
            number_of_test_printouts: { type: String, trim: true, required: false },
            additional_line_for_line_items: { type: Boolean, required: false },
            display_interest_rate_changes: { type: Boolean, required: false },
            print_interest_rate_table: { type: Boolean, required: false },
            leap_year: { type: Boolean, required: false },
            business_area_allocation: { type: Boolean, required: false },
            print_account_overview: { type: Boolean, required: false },
            acct_overview_printer_batch: { type: String, trim: true, required: false },
        }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("interest_calculate_arrears", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
