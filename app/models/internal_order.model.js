const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';
const STATUS_CREATED = 'CRTD';
const STATUS_RELEASE = 'REL';
const STATUS_TECHNICALLY_COMPLETE = 'TECO';

const internalOrderSchema = new mongoose.Schema({
    header: {
        order_type: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'order_types' },
        order: { type: String, trim: true, required: false },
        controlling_area: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'controlling_areas' },
        description: { type: String, trim: true, required: true },
    },
    assignments: {
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        business_area: { type: String, trim: true, required: false },
        plant: { type: String, trim: true, required: false },
        functional_area: { type: String, trim: true, required: false },
        object_class: { type: String, trim: true, required: true },
        profit_center: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'profit_centers' },
        responsible_cctr: { type: String, trim: true, required: false },
        user_responsible: { type: String, trim: true, required: true },
        wbs_element: { type: String, trim: true, required: false },
        requesting_cctr: { type: String, trim: true, required: false },
        requesting_co_code: { type: String, trim: true, required: false },
        requesting_order: { type: String, trim: true, required: false },
        sales_order: { type: String, trim: true, required: false },
        external_order_no: { type: String, trim: true, required: false },
    },
    control_data: {
        status: {
            system_status: { type: String, default: STATUS_CREATED, required: true },
            user_status: { type: String, trim: true, required: false },
            status_number: { type: Number, trim: true, required: true },
        },
        control_data: {
            currency: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' },
            order_category: { type: Number, trim: true, required: true },
            actual_posted_cctr: { type: String, trim: true, required: false },
            statistical_order: { type: Boolean, required: true },
            plan_integrated_order: { type: Boolean, required: true },
            revenue_postings: { type: Boolean, required: true },
            commitment_update: { type: Boolean, required: true },
        }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }

});

module.exports = mongoose.model('internal_order', internalOrderSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
module.exports.STATUS_CREATED = STATUS_CREATED;
module.exports.STATUS_RELEASE = STATUS_RELEASE;
module.exports.STATUS_TECHNICALLY_COMPLETE = STATUS_TECHNICALLY_COMPLETE;
