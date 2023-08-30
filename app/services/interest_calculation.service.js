const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/interest_calculation.model");

exports.create = async (data) => {
    const defaultVariable = await DefaultModel.create(data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = DefaultModel.STATUS_INACTIVE;

    const results = await DefaultModel.aggregate(this.pipeline(filters));
    const defaultVariable = results[0];

    if (!defaultVariable) return null;

    return this.mapData(defaultVariable);
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

    const filters = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(filters))
        .collation({ locale: "en" })
        .sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
        .limit(pageLimit);

    const bankKeyData = results.map((o) => this.mapData(o));

    const bankKeyTotal = await DefaultModel.countDocuments(filters);

    return { data: bankKeyData, total: bankKeyTotal };
};

exports.getByCode = async (document_number, existing_id) => {
    const options = {
        document_number: document_number,
        status: DefaultModel.STATUS_ACTIVE,
    };

    if (existing_id && existing_id != "") options["_id"] = { $ne: existing_id };

    return (await DefaultModel.countDocuments(options)) > 0;
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'companies',
                localField: 'header.company_code',
                foreignField: '_id',
                as: 'company'
            },
        },
        {
            $unwind: {
                path: "$company",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'vendor_general_datas',
                localField: 'header.vendor',
                foreignField: '_id',
                as: 'vendor'
            },
        },
        {
            $unwind: {
                path: "$vendor",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'authorizations',
                localField: 'window_1.accounting_information.authorization',
                foreignField: '_id',
                as: 'authorization'
            },
        },
        {
            $unwind: {
                path: "$authorization",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'sort_keys',
                localField: 'window_1.accounting_information.sort_key',
                foreignField: '_id',
                as: 'sort_key'
            },
        },
        {
            $unwind: {
                path: "$sort_key",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: 'cash_mgmnt_groups',
                localField: 'window_1.accounting_information.cash_mgmnt_group',
                foreignField: '_id',
                as: 'cash_mgmnt_group'
            },
        },
        {
            $unwind: {
                path: "$cash_mgmnt_group",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: 'release_groups',
                localField: 'window_1.accounting_information.release_group',
                foreignField: '_id',
                as: 'release_group'
            },
        },
        {
            $unwind: {
                path: "$release_group",
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters },
    ];
};

exports.mapData = (data) => {
    const { company, vendor, authorization, sort_key, cash_mgmnt_group, release_group } = data;

    return {

        _id: data._id,
        header: {
            vendor: (vendor) ? {
                _id: vendor._id,
                code: vendor.header.vendor_code,
                name: vendor.address.name.name
            } : null,
            company_code: (company) ? {
                _id: company._id,
                code: company.code,
                name: company.company_name,
                description: company.desc
            } : null,
        },
        window_1: {
            accounting_information: {
                recon_account: data.window_1.accounting_information.recon_account,
                head_office: data.window_1.accounting_information.head_office,
                authorization: (authorization) ? {
                    _id: authorization._id,
                    code: authorization.code,
                    name: authorization.name,
                    description: authorization.desc
                } : null,
                minority_indic: data.window_1.accounting_information.minority_indic,
                sort_key: (sort_key) ? {
                    _id: sort_key._id,
                    code: sort_key.code,
                    name: sort_key.name,
                    description: sort_key.desc
                } : null,
                subsidy_indic: data.window_1.accounting_information.subsidy_indic,
                cash_mgmnt_group: (cash_mgmnt_group) ? {
                    _id: cash_mgmnt_group._id,
                    code: cash_mgmnt_group.code,
                    name: cash_mgmnt_group.name,
                    description: cash_mgmnt_group.desc
                } : null,
                release_group: (release_group) ? {
                    _id: release_group._id,
                    code: release_group.code,
                    name: release_group.name,
                    description: release_group.desc
                } : null,
                certificatn_date: data.window_1.accounting_information.certificatn_date,
            },
        },
        window_2: data.window_2,
        window_3: data.window_3,
        window_4: data.window_4,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated,
    };
};
