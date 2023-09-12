const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    header: {
        vendor: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'vendor_general_datas' },
        doc_date: { type: Date, default: () => new Date(), required: false },
    },
    window: {
        org_data: {
            purchasing_org: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'purchasing_groups' },
            purch_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'purchasing_groups' },
            company_code: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'companies' },
        },
        additional_data: {
            validity_start: { type: Date, default: () => new Date(), required: false },
            validity_end: { type: Date, default: () => new Date(), required: false },
            collective_no: { type: Number, required: false },
        },
        account_assignments: {
            acc_ass_cat: { type: String, required: false },
            distribution: { type: String, required: false },
            co_code: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'companies' },
            unloading_point: { type: String, required: false },
            recipient: { type: String, required: false },
            gl_account: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'gl_accounts' },
            co_area: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'controlling_areas' },
            cost_center: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'cost_centers' },
            order: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'order_types' },
            network: { type: String, required: false },
        },
        invoice: {
            tax_code: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'tax_codes' },
        },
    },
    condition: {
        condition: {
            qty: { type: Number, required: false },
            net: { type: Number, required: false },
            currency: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'currencies' },

        },
        items: [{
            cnty: { type: String, required: false },
            name: { type: String, required: false },
            amount: { type: Number, required: false },
            per: { type: Number, required: false },
            condition_value: { type: Number, required: false },
            curr: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'currencies' },
            status: { type: String, required: false },
            numc: { type: Number, required: false },
            oun: { type: String, required: false },
            cdcur: { type: String, required: false },
        }]
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("purchase_order", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
