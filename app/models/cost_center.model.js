const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const costCtrSchema = new mongoose.Schema({
    cost_center_code: { type: Number, required: true },
    controlling_area_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'controlling_areas' },
    valid_range: {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
    },
    names: {
        name: { type: String, trim: true, required: true },
        desc: { type: String, trim: true, required: true },
    },
    basic_data: {
        user_responsible_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'users' },
        person_responsible: { type: String, trim: true, required: false },
        department_id: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'departments' },
        cost_ctr_category_id: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'cost_center_catergories' },
        hierarchy_area_id: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'hierarcy_areas' },
        company_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
        business_area: { type: Number, required: false },
        functional_area: { type: Number, required: true },
        currency_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'currencies' },
        profit_center_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'profit_centers' }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('cost_center', costCtrSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;