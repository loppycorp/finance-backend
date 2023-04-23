const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const costCtrSchema = new mongoose.Schema({
    code: { type: Number, required: true }, 
    controlling_area_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'controlling_areas' },
    valid_range: {
        from:  { type: Date, required: true },
        to:  { type: Date, required: true },
    },
    names: {
        name: { type: String, trim: true, required: true },
        desc: { type: String, trim: true, required: true },
    },
    basic_data: {
        user_responsible_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'users' },
        person_responsible_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'users' },
        department_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'departmens' },
        cost_ctr_category_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'cost_center_catergories' },
        hierarchy_area_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'hierarcy_areas' },
        company_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'company' },
        business_area: { type: Number, required: true },
        functional_area: { type: Number, required: true },
        currency_id: { type: String, trim: true, required: true },
        profit_center_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'profit_centers' }
    },
    status:  { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date,  default: () => new Date(), required: true }
});

module.exports = mongoose.model('cost_center', costCtrSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;