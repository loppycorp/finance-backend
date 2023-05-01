const ObjectId = require('mongoose').Types.ObjectId;
const defaultModel = require('../models/customer_pymnt_transc.model');

exports.create = async (data) => {
    const customerPymntTransc = await defaultModel.create(data);

    if (!customerPymntTransc) return false;

    return await this.get(customerPymntTransc._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: defaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = defaultModel.STATUS_INACTIVE;

    const results = await defaultModel.aggregate(this.pipeline(filters))
    const customerPymntTransc = results[0];

    if (!customerPymntTransc) return null;

    return this.mapData(customerPymntTransc);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const customerPymntTransc = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!customerPymntTransc) return false;

    return await this.get(customerPymntTransc._id);
};

exports.delete = async (id) => {
    const customerPymntTransc = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: defaultModel.STATUS_INACTIVE }
    });

    if (!customerPymntTransc) return false;

    return await this.get(customerPymntTransc._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: defaultModel.STATUS_ACTIVE };

    const results = await defaultModel.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const customerPymntTranscData = results.map(o => this.mapData(o));

    const customerPymntTranscTotal = await defaultModel.countDocuments(filters);

    return { data: customerPymntTranscData, total: customerPymntTranscTotal };
};

exports.pipeline = (filters) => {
    return [
        // {
        //     $lookup: {
        //         from: 'vendors',
        //         localField: 'vendor_id',
        //         foreignField: '_id',
        //         as: 'vendor_id'
        //     },
        // },
        // { $unwind: '$vendor_id' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        vendor_id: data.vendor_id,
        vendor_code: data.vendor_code,
        bank_details: data.bank_details,
        payment_transactions: data.payment_transactions,
        alternative_payee: data.alternative_payee,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    }
};