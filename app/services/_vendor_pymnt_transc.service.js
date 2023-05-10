const ObjectId = require('mongoose').Types.ObjectId;
const VendorPymntTransc = require('../models/vendor_pymnt_transc.model');

exports.create = async (data) => {
    const vendorPymntTransc = await VendorPymntTransc.create(data);

    if (!vendorPymntTransc) return false;

    return await this.get(vendorPymntTransc._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: VendorPymntTransc.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = VendorPymntTransc.STATUS_INACTIVE;

    const results = await VendorPymntTransc.aggregate(this.pipeline(filters))
    const vendorPymntTransc = results[0];

    if (!vendorPymntTransc) return null;

    return this.mapData(vendorPymntTransc);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const vendorPymntTransc = await VendorPymntTransc.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!vendorPymntTransc) return false;

    return await this.get(vendorPymntTransc._id);
};

exports.delete = async (id) => {
    const vendorPymntTransc = await VendorPymntTransc.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: VendorPymntTransc.STATUS_INACTIVE }
    });

    if (!vendorPymntTransc) return false;

    return await this.get(vendorPymntTransc._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: VendorPymntTransc.STATUS_ACTIVE };

    const results = await VendorPymntTransc.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const vendorPymntTranscData = results.map(o => this.mapData(o));

    const vendorPymntTranscTotal = await VendorPymntTransc.countDocuments(filters);

    return { data: vendorPymntTranscData, total: vendorPymntTranscTotal };
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