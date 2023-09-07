const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
    header: {
        material: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_types' },
        plant: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'plants' },
        sales_document: { type: String, trim: true, required: false },
        sales_document_item: { type: String, trim: true, required: false },
        wbs_elemet: { type: String, trim: true, required: false },
        sequence: { type: Number, required: false },
    },
    window: {
        validity: {
            change_number: { type: Number, required: false },
            key_date: { type: Date, default: () => new Date(), required: false },
            revision_level: { type: String, trim: true, required: false },
        },
        additional_criteria_for_list_selection: {
            plant: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'plants' },
            group_counter: { type: String, trim: true, required: false },
            task_list_status: { type: String, trim: true, required: false },
            planner_group: { type: String, trim: true, required: false },
        },
    },
    items: {
        operation_overview: [{
            op: { type: String, trim: true, required: false },
            sop: { type: String, trim: true, required: false },
            work_ce: { type: String, trim: true, required: false },
            plnt: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'plants' },
            co: { type: String, trim: true, required: false },
            standard: { type: String, trim: true, required: false },
            description: { type: String, trim: true, required: false },
            lo: { type: Boolean, required: false },
            p: { type: Boolean, required: false },
            ci: { type: Boolean, required: false },
            o: { type: Boolean, required: false },
            pe: { type: Boolean, required: false },
            c: { type: Boolean, required: false },
            su: { type: Boolean, required: false },
            bas: { type: Boolean, required: false },
        }]
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});
module.exports = mongoose.model("display_routing", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
