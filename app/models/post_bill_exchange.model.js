const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const postBillExchangeSchema = new mongoose.Schema({
    doc_date: { type: String, trim: true, required: true },
    type: { type: String, trim: true, required: false },
    company_code: { type: String, trim: true, required: false },
    
    post_date: { type: String, trim: true, required: false },
    period: { type: String, trim: true, required: false },
    currency: { type: String, trim: true, required: false },

    doc_num: { type: String, trim: true, required: false },
    fiscal_yr: { type: String, trim: true, required: false },
    trans_date: { type: String, trim: true, required: false },

    reference: { type: String, trim: true, required: false },
    cross_cc_no: { type: String, trim: true, required: false },

    doc_head_text: { type: String, trim: true, required: false },
    trad_part_ba: { type: String, trim: true, required: false },


    status:  { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date,  default: () => new Date(), required: true }
});

module.exports = mongoose.model('post_bill_exchange', postBillExchangeSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;