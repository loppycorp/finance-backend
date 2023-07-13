const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const chequeLotSchema = new mongoose.Schema({
    cheque_id: { type: Number, required: false },
    cheque_lot_details: { type: String, trim: true, required: false },
    cheque_lot: { type: Number, required: false },
    cheque_number: { type: Number, required: false },
    is_used: { type: Boolean, required: false },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('cheque_lot_reference', chequeLotSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

