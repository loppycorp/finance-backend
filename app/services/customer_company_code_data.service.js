const ObjectId = require('mongoose').Types.ObjectId;
const defaultModel = require('../models/customer_company_code_data.model');

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

exports.getByCode = async (company_code) => {
    const isCodeExists = async (company_code, existing_id) => {
        const options = { company_code: company_code, status: defaultModel.STATUS_ACTIVE };

        if (existing_id && existing_id != '')
            options['_id'] = { $ne: existing_id };

        return defaultModel.countDocuments(options) > 0;
    }
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'customer_general_datas',
                localField: 'customer_id',
                foreignField: '_id',
                as: 'customer_id'
            },
        },
        { $unwind: '$customer_id' },
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
        customer_id: data.customer_id,
        customer_code: data.customer_code,
        company_code_id: data.company_code_id,
        account_management: data.account_management,
        payment_transactions: data.payment_transactions,
        correspondence: data.correspondence,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};