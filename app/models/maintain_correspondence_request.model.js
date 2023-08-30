const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        company_code: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "companies",
        },
        customer: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "customer_general_datas",
        },
        vendor: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "vendor_general_datas",
        },
        oi_key_date: { type: Date, default: () => new Date(), required: false },
    },
    general_selections: {
        general_selections: {
            correspondence: { type: String, trim: true, required: false },
            correspondence_to: { type: String, trim: true, required: false },
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
            account_type: { type: String, trim: true, required: false },
            account_type_to: { type: String, trim: true, required: false },
            open_item_account: { type: String, trim: true, required: false },
            open_item_account_to: { type: String, trim: true, required: false },
            document_number: { type: Number, required: false },
            document_number_to: { type: Number, required: false },
            fiscal_year: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "fiscal_periods",
            },
            fiscal_year_to: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "fiscal_periods",
            },
            user: { type: String, trim: true, required: false },
            user_to: { type: String, trim: true, required: false },
            date_of_request: { type: Date, default: () => new Date(), required: false },
            date_of_request_to: { type: Date, default: () => new Date(), required: false },
            time_of_request: { type: String, trim: true, required: false },
            time_of_request_to: { type: String, trim: true, required: false },
            print_date: { type: Date, default: () => new Date(), required: false },
            print_date_to: { type: Date, default: () => new Date(), required: false },
            cash_journal_number: { type: Number, required: false },
            cash_journal_number_to: { type: Number, required: false },
        },
    },
    further_selections: {
        further_selections: {
            entries_without_print_date: { type: Boolean, required: false },
            entries_with_print_date: { type: Boolean, required: false },
        },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("maintain_correspondence_request", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
