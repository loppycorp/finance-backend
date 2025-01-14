const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const STATUS_PROFIT_CTR_INACTIVE_CREATE = 'INACTIVE_CREATE';
const STATUS_PROFIT_CTR_INACTIVE_UPDATE = 'INACTIVE_UPDATE';
const STATUS_PROFIT_CTR_INACTIVE_DELETE = 'INACTIVE_DELETE';
const STATUS_PROFIT_CTR_ACTIVE_CREATE = 'ACTIVE_CREATE';
const STATUS_PROFIT_CTR_ACTIVE_UPDATE = 'ACTIVE_UPDATE';
const STATUS_PROFIT_CTR_ACTIVE_DELETE = 'ACTIVE_DELETE';

const profitCtrSchema = new mongoose.Schema({
    header: {
        controlling_area: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'controlling_areas' },
    },
    basic_data: {
        description: {
            profit_center_code: { type: Number, required: true },
            analysis_period: {
                from: { type: Date, required: true },
                to: { type: Date, required: true },
            },
            name: { type: String, trim: true, required: true },
            long_text: { type: String, trim: true, required: false },
            status: { type: String, default: STATUS_PROFIT_CTR_INACTIVE_CREATE, required: false },
        },
        basic_data: {
            user_responsible: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'users' },
            person_responsible: { type: String, trim: true, required: true },
            department: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'departments' },
            profit_ctr_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'profit_center_groups' },
            segment: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'segments' },
        },
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
    created_by: { type: String, required: true },
    updated_by: { type: String, required: true },

});

module.exports = mongoose.model('profit_center', profitCtrSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

module.exports.STATUS_PROFIT_CTR_INACTIVE_CREATE = STATUS_PROFIT_CTR_INACTIVE_CREATE;
module.exports.STATUS_PROFIT_CTR_INACTIVE_UPDATE = STATUS_PROFIT_CTR_INACTIVE_UPDATE;
module.exports.STATUS_PROFIT_CTR_INACTIVE_DELETE = STATUS_PROFIT_CTR_INACTIVE_DELETE;
module.exports.STATUS_PROFIT_CTR_ACTIVE_CREATE = STATUS_PROFIT_CTR_ACTIVE_CREATE;
module.exports.STATUS_PROFIT_CTR_ACTIVE_UPDATE = STATUS_PROFIT_CTR_ACTIVE_UPDATE;
module.exports.STATUS_PROFIT_CTR_ACTIVE_DELETE = STATUS_PROFIT_CTR_ACTIVE_DELETE;

module.exports.getProfitStatusList = () => {
    return {
        [STATUS_PROFIT_CTR_INACTIVE_CREATE]: 'Inactive: Create',
        [STATUS_PROFIT_CTR_INACTIVE_UPDATE]: 'Inactive: Update',
        [STATUS_PROFIT_CTR_INACTIVE_DELETE]: 'Inactive: Delete',
        [STATUS_PROFIT_CTR_ACTIVE_CREATE]: 'Active: Create',
        [STATUS_PROFIT_CTR_ACTIVE_UPDATE]: 'Active: Update',
        [STATUS_PROFIT_CTR_ACTIVE_DELETE]: 'Active: Delete'
    };
};

module.exports.getProfitStatusLabel = (profit_status) => {
    return this.getProfitStatusList()[profit_status];
};