const ObjectId = require('mongoose').Types.ObjectId;
const Vendor = require('../models/vendor_general_data.model');

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
                from: 'companies',
                localField: 'header.company_code',
                foreignField: '_id',
                as: 'company_code'
            },
        },
        { $unwind: '$company_code' },
        {
            $lookup: {
                from: 'vendor_account_groups',
                localField: 'header.account_group',
                foreignField: '_id',
                as: 'account_group'
            },
        },
        // { $unwind: '$account_group' },
        {
            $lookup: {
                from: 'customers',
                localField: 'control_data.account_control.customer',
                foreignField: '_id',
                as: 'customer'
            },
        },
        // { $unwind: '$customer' },
        {
            $lookup: {
                from: 'trading_partners',
                localField: 'control_data.account_control.trading_partner',
                foreignField: '_id',
                as: 'trading_partner'
            },
        },
        // { $unwind: '$trading_partner' },
        {
            $lookup: {
                from: 'authorizations',
                localField: 'control_data.account_control.authorization',
                foreignField: '_id',
                as: 'authorization'
            },
        },
        // { $unwind: '$authorizations' },
        {
            $lookup: {
                from: 'corporate_groups',
                localField: 'control_data.account_control.corporate_group',
                foreignField: '_id',
                as: 'corporate_group'
            },
        },
        // { $unwind: '$corporate_group' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            vendor_code: data.header.vendor_code,
            company_code: {
                _id: data.company_code._id
            },
            account_group: {
                _id: data.account_group._id
            },
        },
        address: data.address,
        control_data: {
            account_control: {
                customer: {
                    _id: data.customer._id
                },
                trading_partner: {
                    _id: data.trading_partner._id
                },
                authorization: {
                    _id: data.authorization._id
                },
                corporate_group: {
                    _id: data.corporate_group._id
                },
            }
        },
        payment_transactions: {
            bank_details: data.payment_transactions.bank_details,
            payment_transactions: data.payment_transactions.payment_transactions,
            alternative_payee: data.payment_transactions.alternative_payee,
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};