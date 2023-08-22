const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({

    header: {
        company_code: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "companies",
        },
        plant: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "plants",
        },
        eexcise_group: { type: Number, required: false },
        sub_transaction_type: { type: String, trim: true, required: false },
        adc_sub_transation_type: { type: String, trim: true, required: false },
        period: { type: Date, required: false },
        to: { type: Date, required: false },
        excise_invoice: { type: Date, required: false },
        to: { type: Date, required: false },
        business_area: { type: String, trim: true, required: false },
        fortnightly_pymt_posting_date: { type: Date, required: false },
        pay_cenvat_from_ser_tax_cr: { type: String, trim: true, required: false },
        pay_ser_tax_from_cenvat_cr: { type: String, trim: true, required: false },
        service_tax_credit_account: { type: String, trim: true, required: false },
        secess_on_ser_tax_account: { type: String, trim: true, required: false },
        service_tax_payable_account: { type: String, trim: true, required: false },
        ecs_on_ser_payable_account: { type: String, trim: true, required: false },
        secess_on_ser_payable_account: { type: String, trim: true, required: false },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("monthly_utilization", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
