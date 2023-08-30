const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    header: {
        material: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_types' },
        plant: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'plants' },
        alternative_bom: { type: String, trim: true, required: false },
    },
    items: {
        items: [{
            ict: { type: String, trim: true, required: false },
            component: { type: String, trim: true, required: false },
            conponent_description: { type: String, trim: true, required: false },
            quantity: { type: Number, required: false },
            un: { type: String, trim: true, required: false },
            as: { type: String, trim: true, required: false },
            sis: { type: String, trim: true, required: false },
            valid_from: { type: Date, required: false },
            valid_to: { type: Date, required: false },
        }],
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("display_bom", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
