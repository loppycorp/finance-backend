const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const bankSchema = new mongoose.Schema({
    header: {
        bank_country: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'countries' },
        bank_key_code: { type: String, trim: true, required: true },
    },
    details: {
        address: {
            name: { type: String, trim: true, required: true },
            region: { type: Number, required: false },
            street: { type: String, trim: true, required: false },
            city: { type: String, trim: true, required: false },
            bank_branch: { type: String, trim: true, required: true },
        },
        control_data: {
            swift_code: { type: String, trim: true, required: true },
            bank_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'bank_groups' },
            postbank_account: { type: Boolean, required: false },
            bank_number: { type: Number, required: true },
        }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('bank_key', bankSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

