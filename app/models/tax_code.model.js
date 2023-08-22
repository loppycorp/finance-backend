const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const processManualCtrGrpSchema = new mongoose.Schema({
    tax_code: { type: String, trim: true, required: false },
    description: { type: String, trim: true, required: false },
    jmx1: { type: Number, required: false },
    jmop: { type: Number, required: false },
    jex1: { type: Number, required: false },
    jec1: { type: Number, required: false },
    jhx1: { type: Number, required: false },
    jse1: { type: Number, required: false },
    jvrd: { type: Number, required: false },
    smx1: { type: Number, required: false },
    jsrt: { type: Number, required: false },
    jec3: { type: Number, required: false },
    jse3: { type: Number, required: false },
    jmx2: { type: Number, required: false },
    jmi2: { type: Number, required: false },
    jmip: { type: Number, required: false },
    jex2: { type: Number, required: false },
    jec2: { type: Number, required: false },
    jhx2: { type: Number, required: false },
    jse2: { type: Number, required: false },
    jvrn: { type: Number, required: false },
    jipc: { type: Number, required: false },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('tax_code', processManualCtrGrpSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;