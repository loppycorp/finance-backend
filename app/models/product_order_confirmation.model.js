const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    header: {
        confirmation: { type: String, trim: true, required: false },
        order: { type: String, trim: true, required: false },
        operation: { type: String, trim: true, required: false },
        sub_operation: { type: String, trim: true, required: false },
        work_center: { type: String, trim: true, required: false },
        material: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_types' },
        sequence: { type: String, trim: true, required: false },
        plant: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'plants' },
        confirm_type: { type: String, trim: true, required: false },
        clear_open_reservations: { type: String, trim: true, required: false },
    },
    window: {
        date: {
            personnel_no: { type: String, trim: true, required: false },
            work_center: { type: String, trim: true, required: false },
            plant: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'plants' },
            posting_date: { type: Date, default: () => new Date(), required: false },
            time_id: { type: Number, required: false },
        },
        quantity: {
            yield: { type: String, trim: true, required: false },
            unit: { type: String, trim: true, required: false },
            scrap: { type: String, trim: true, required: false },
            rework: { type: String, trim: true, required: false },
        }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("product_order_confirmation", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
