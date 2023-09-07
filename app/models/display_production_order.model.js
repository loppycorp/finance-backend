const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    header: {
        order: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'order_types' },
        material: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_types' },
        status: { type: String, trim: true, required: false },
    },
    general: {
        quantities: {
            total_qty: { type: String, trim: true, required: false },
            delivered: { type: String, trim: true, required: false },
            scrap_portion: { type: String, trim: true, required: false },
            expect_yield_var: { type: String, trim: true, required: false },
        },
        basic_dates: {
            finish: { type: Date, default: () => new Date(), required: false },
            start: { type: Date, default: () => new Date(), required: false },
            release: { type: Date, default: () => new Date(), required: false },
        },
        scheduled: {
            finish: { type: Date, default: () => new Date(), required: false },
            start: { type: Date, default: () => new Date(), required: false },
            release: { type: Date, default: () => new Date(), required: false },
        },
        confirmd: {
            finish: { type: Date, default: () => new Date(), required: false },
            start: { type: Date, default: () => new Date(), required: false },
            release: { type: Date, default: () => new Date(), required: false },
        }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("display_production_order", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
