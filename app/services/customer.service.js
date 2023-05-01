const ObjectId = require('mongoose').Types.ObjectId;
const defaultModel = require('../models/customer.model');

exports.create = async (data) => {

    const customer = await defaultModel.create(data);

    if (!customer) return false;

    return await this.get(customer._id)

};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: defaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = defaultModel.STATUS_INACTIVE;

    const results = await defaultModel.aggregate(this.pipeline(filters))
    const customer = results[0];

    if (!customer) return null;

    return this.mapData(customer);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const customer = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!customer) return false;

    return await this.get(customer._id);
};

exports.delete = async (id) => {
    const customer = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: defaultModel.STATUS_INACTIVE }
    });

    if (!customer) return false;

    return await this.get(customer._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: defaultModel.STATUS_ACTIVE };

    const results = await defaultModel.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const customerData = results.map(o => this.mapData(o));

    const customerTotal = await defaultModel.countDocuments(filters);

    return { data: customerData, total: customerTotal };
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'companies',
                localField: 'company_code_id',
                foreignField: '_id',
                as: 'company'
            },
        },
        { $unwind: '$company' },
        {
            $lookup: {
                from: 'customers',
                localField: 'account_control.customer_id',
                foreignField: '_id',
                as: 'customer'
            },
        },
        // { $unwind: '$customer' },
        {
            $lookup: {
                from: 'trading_partners',
                localField: 'account_control.trading_partner_id',
                foreignField: '_id',
                as: 'trading_partner'
            },
        },
        // { $unwind: '$trading_partner' },
        {
            $lookup: {
                from: 'authorizations',
                localField: 'account_control.authorization_id',
                foreignField: '_id',
                as: 'authorization'
            },
        },
        // { $unwind: '$authorizations' },
        {
            $lookup: {
                from: 'corporate_groups',
                localField: 'account_control.corporate_group_id',
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
        customer_code: data.customer_code,
        company_code_id: data.company_code_id,
        account_group: data.account_group,
        address: data.address,
        control_data: data.control_data,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};