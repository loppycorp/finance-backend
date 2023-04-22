const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';
const STATUS_CREATED = 'CRTD';
const STATUS_RELEASE = 'REL';
const STATUS_TECHNICALLY_COMPLETE = 'TECO';

const internalOrderSchema = new mongoose.Schema({
    order_type:{ type: String, trim: true, required: true}, 
    order: { type: String, trim: true, required: true}, 
    controlling_area:{ type: String, trim: true, required: true}, 
    description:{ type: String, trim: true, required: true}, 
    assignments: {
        company_code:{ type: String, trim: true, required: true},
        business_area:{ type: String, trim: true, required: true},
        plant: { type: String, trim: true, required: true},
        functional_area: { type: String, trim: true, required: true},
        object_class: { type: String, trim: true, required: true},
        profit_center: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'profit_centers' },
        responsible_cctr: { type: String, trim: true, required: true},
        user_responsible: { type: String, trim: true, required: true},
        wbs_element: { type: String, trim: true, required: true},
        requesting_cctr: { type: String, trim: true, required: true},
        requesting_co_code: { type: String, trim: true, required: true},
        requesting_order: { type: String, trim: true, required: true},
        sales_order: { type: String, trim: true, required: true},
        external_order_no: { type: String, trim: true, required: true},
    },
    control_data:{
        status:{
            system_status:{ type: String, default: STATUS_CREATED, required: true },
            user_status:{ type: String, trim: true, required: true},
            status_number:{ type: Number, trim: true, required: true},
        },
        control_data:{
            currency:{ type: String, trim: true, required: true},
            order_category:{ type: Number, trim: true, required: true},
            actual_posted_cctr:{ type: String, trim: true, required: true},
            statistical_order:{ type: Boolean,required: true},
            plan_integrated_order:{ type: Boolean,required: true},
            revenue_postings:{ type: Boolean,required: true},
            commitment_update:{ type: Boolean,required: true},
        }
    },
    status:  { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date,  default: () => new Date(), required: true }
 
});

module.exports = mongoose.model('internal_order', internalOrderSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
module.exports.STATUS_CREATED = STATUS_CREATED;
module.exports.STATUS_RELEASE = STATUS_RELEASE;
module.exports.STATUS_TECHNICALLY_COMPLETE = STATUS_TECHNICALLY_COMPLETE;
