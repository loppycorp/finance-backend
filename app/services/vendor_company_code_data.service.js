const ObjectId = require('mongoose').Types.ObjectId;
const Vendor = require('../models/vendor_company_code_data.model');

exports.create = async (data) => {
    const vendor = await Vendor.create(data);

    if (!vendor) return false;

    return await this.get(vendor._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Vendor.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Vendor.STATUS_INACTIVE;

    const results = await Vendor.aggregate(this.pipeline(filters))
    const vendor = results[0];

    if (!vendor) return null;

    return this.mapData(vendor);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const vendor = await Vendor.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!vendor) return false;

    return await this.get(vendor._id);
};

exports.delete = async (id) => {
    const vendor = await Vendor.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Vendor.STATUS_INACTIVE }
    });

    if (!vendor) return false;

    return await this.get(vendor._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: Vendor.STATUS_ACTIVE };

    const results = await Vendor.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const vendorData = results.map(o => this.mapData(o));

    const vendorTotal = await Vendor.countDocuments(filters);

    return { data: vendorData, total: vendorTotal };
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'vendor_general_datas',
                localField: 'vendor_id',
                foreignField: '_id',
                as: 'vendor_id'
            },
        },
        { $unwind: '$vendor_id' },
        {
            $lookup: {
                from: 'companies',
                localField: 'company_code_id',
                foreignField: '_id',
                as: 'company_code_id'
            },
        },
        { $unwind: '$company_code_id' },
        // {
        //     $lookup: {
        //         from: 'trading_partners',
        //         localField: 'account_control.trading_partner_id',
        //         foreignField: '_id',
        //         as: 'trading_partner'
        //     },
        // },
        // { $unwind: '$trading_partner' },
        // {
        //     $lookup: {
        //         from: 'authorizations',
        //         localField: 'account_control.authorization_id',
        //         foreignField: '_id',
        //         as: 'authorization'
        //     },
        // },
        // { $unwind: '$authorization' },
        // {
        //     $lookup: {
        //         from: 'corporate_groups',
        //         localField: 'account_control.corporate_group_id',
        //         foreignField: '_id',
        //         as: 'corporate_group'
        //     },
        // },
        // { $unwind: '$corporate_group' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        vendor_id: data.vendor_id,
        vendor_code: data.vendor_code,
        company_code_id: data.company_code_id,
        account_management: data.account_management,
        payment_transactions: data.payment_transactions,
        correspondence: data.correspondence,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};