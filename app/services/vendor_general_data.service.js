const ObjectId = require('mongoose').Types.ObjectId;
const DefaultModel = require('../models/vendor_general_data.model');

exports.create = async (data) => {
    const defaultVariable = await DefaultModel.create(data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};
exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = DefaultModel.STATUS_INACTIVE;

    const results = await DefaultModel.aggregate(this.pipeline(filters))
    const defaultModel = results[0];

    if (!defaultModel) return null;

    return this.mapData(defaultModel);
};
exports.update = async (id, data) => {
    data.date_updated = new Date();

    const defaultVariable = await DefaultModel.findByIdAndUpdate(
        { _id: ObjectId(id) },
        data
    );

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};
exports.delete = async (id) => {
    const defaultVariable = await DefaultModel.findByIdAndUpdate(
        { _id: ObjectId(id) },
        {
            $set: { status: DefaultModel.STATUS_INACTIVE },
        }
    );

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(options))
        .collation({ locale: "en" })
        .sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
        .limit(pageLimit);

    const defaultVariableData = results.map((o) => this.mapData(o));

    const defaultVariableTotal = await DefaultModel.countDocuments(options);

    return { data: defaultVariableData, total: defaultVariableTotal };
};

exports.getByCode = async (code, existing_id) => {
    const options = { "header.vendor_code": code, status: DefaultModel.STATUS_ACTIVE, };

    if (existing_id && existing_id != "")
        options["_id"] = { $ne: existing_id };

    return (await DefaultModel.countDocuments(options)) > 0;
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
            account_group: (data.header.account_group) ? {
                _id: data.account_group._id
            } : null,
        },
        address: data.address,
        control_data: {
            account_control: {
                customer: (data.control_data.account_control.customer) ? {
                    _id: data.customer._id
                } : null,
                trading_partner: (data.control_data.account_control.trading_partner) ? {
                    _id: data.trading_partner._id
                } : null,
                authorization: (data.control_data.account_control.authorization) ? {
                    _id: data.authorization._id
                } : null,
                corporate_group: (data.control_data.account_control.corporate_group) ? {
                    _id: data.corporate_group._id
                } : null
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