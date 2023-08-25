const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        unit_sales: { type: Number, required: false },
        sold_to_party: { type: Number, required: false },
        po_number: { type: Number, required: false },
        po_date: { type: Date, default: () => new Date(), required: false },
        net_value: { type: Number, required: false },
    },
    sales: {
        items: {
            req_delv_date: { type: Date, default: () => new Date(), required: false },
            complete_dlv: { type: String, trim: true, required: false },
            delivery_block: { type: String, trim: true, required: false },
            payment_card: { type: String, trim: true, required: false },
            card_verif_code: { type: String, trim: true, required: false },
            payment_terms: { type: String, trim: true, required: false },
            order_reason: { type: String, trim: true, required: false },
            delivery_plant: { type: String, trim: true, required: false },
            total_weight: { type: String, trim: true, required: false },
            volume: { type: String, trim: true, required: false },
            pricing_date: { type: Date, default: () => new Date(), required: false },
            exp_date: { type: Date, default: () => new Date(), required: false },
        }
    },
    all_items: {
        items: [{
            material: { type: String, trim: true, required: false },
            order_quantity: { type: Number, required: false },
            un: { type: String, trim: true, required: false },
            s: { type: String, trim: true, required: false },
            description: { type: String, trim: true, required: false },
            customer_material_numb: { type: String, trim: true, required: false },
            itca: { type: String, trim: true, required: false },
            hl_itm: { type: String, trim: true, required: false },
            d: { type: String, trim: true, required: false },
            first_date: { type: Date, default: () => new Date(), required: false },
            plnt: { type: String, trim: true, required: false },
            batch: { type: String, trim: true, required: false },
        }],
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("sales_order", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
