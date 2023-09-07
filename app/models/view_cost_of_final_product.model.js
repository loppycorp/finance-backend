const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    header: {
        material: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_types' },
        plant: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'plants' },
    },
    window: {
        costing_data: {
            costing_variant: { type: String, trim: true, required: false },
            costing_version: { type: String, trim: true, required: false },
            costing_lot_size: { type: String, trim: true, required: false },
            transfer_control: { type: String, trim: true, required: false },
        },
        costs: {
            costs_based_on: { type: String, trim: true, required: false },
            component_view: [{
                cost_component_view: { type: String, trim: true, required: false },
                total_costs: { type: Number, required: false },
                fixed_costs: { type: Number, required: false },
                variable: { type: String, trim: true, required: false },
                currency: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'currencies' },
            }],
            items: [{
                i: { type: String, trim: true, required: false },
                resource: { type: String, trim: true, required: false },
                cost_element: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'cost_element_categories' },
                total_value: { type: Number, required: false },
                fixed_value: { type: Number, required: false },
                currency: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'currencies' },
            }]
        }
    },

    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("view_cost_of_final_product", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
