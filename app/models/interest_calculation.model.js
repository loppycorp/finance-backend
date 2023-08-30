const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        vendor: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "vendor_general_datas",
        },
        company_code: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "companies",
        },
    },
    window_1: {
        accounting_information: {
            recon_account: { type: String, trim: true, required: false },
            head_office: { type: String, trim: true, required: false },
            authorization: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "authorizations",
            },
            minority_indic: { type: String, trim: true, required: false },
            sort_key: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "sort_keys",
            },
            subsidy_indic: { type: String, trim: true, required: false },
            cash_mgmnt_group: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "cash_mgmnt_groups",
            },
            release_group: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false,
                ref: "release_groups",
            },
            certificatn_date: { type: Date, default: () => new Date(), required: false },
        },
    },
    window_2: {
        interest_calculation: {
            interest_indic: { type: String, trim: true, required: false },
            interest_freq: { type: String, trim: true, required: false },
            last_key_date: { type: Date, default: () => new Date(), required: false },
            last_interest_run: { type: String, trim: true, required: false },
        },
    },
    window_3: {
        reference_data: {
            prev_acc_no: { type: Number, required: false },
            personnel_number: { type: Number, required: false },
        },
    },
    window_4: {
        default_data_for_tax_reports: {
            activity_code: { type: String, trim: true, required: false },
            distr_type: { type: String, trim: true, required: false },
        },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("interest_calculation", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
