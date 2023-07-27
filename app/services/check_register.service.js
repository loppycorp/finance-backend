const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/check_register.model");

exports.create = async (data) => {
    console.log(data)
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

// exports.getByCode = async (house_bank_code, existing_id) => {
//     const options = {
//         house_bank_code: house_bank_code,
//         status: DefaultModel.STATUS_ACTIVE,
//     };

//     if (existing_id && existing_id != "") options["_id"] = { $ne: existing_id };

//     return (await DefaultModel.countDocuments(options)) > 0;
// };

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'companies',
                localField: 'header.paying_company_code',
                foreignField: '_id',
                as: 'paying_company_code'
            },
        },
        {
            $unwind: {
                path: '$paying_company_code',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'house_banks',
                localField: 'header.house_bank',
                foreignField: '_id',
                as: 'house_bank'
            },
        },
        {
            $unwind: {
                path: '$house_bank',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'gl_accounts',
                localField: 'header.account_id',
                foreignField: '_id',
                as: 'account_id'
            },
        },
        {
            $unwind: {
                path: '$account_id',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'bank_keys',
                localField: 'general_selection.selection.bank_key',
                foreignField: '_id',
                as: 'bank_key'
            },
        },
        {
            $unwind: {
                path: '$bank_key',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'general_selection.general_selection.currency',
                foreignField: '_id',
                as: 'currency'
            },
        },

        {
            $unwind: {
                path: '$currency',
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters },
    ];
};

exports.mapData = (data) => {
    const { bank_keys, currencies } = data;

    return {
        _id: data._id,
        header: {
            paying_company_code: {
                _id: data.paying_company_code._id,
                code: data.paying_company_code.code,
                description: data.paying_company_code.desc
            },
            paying_company_code_to: data.header.paying_company_code,
            house_bank: {
                _id: data.house_bank._id,
                code: data.house_bank.header.house_bank_code,
                description: data.house_bank.address.name
            },
            house_bank_to: data.header.house_bank_to,
            account_id: {
                _id: data.account_id._id,
                code: data.account_id.header.gl_account_code,
                description: data.account_id.type_description.description.short_text
            },
            account_id_to: data.header.account_id_to,
            payroll_checks: data.header.payroll_checks,
        },
        general_selection: {
            general_selection: {
                bank_key: (bank_keys) ? {
                    _id: bank_keys._id,
                    name: bank_keys.name
                } : null,
                bank_key_to: data.general_selection.general_selection.bank_key_to,
                bank_account: data.general_selection.general_selection.bank_account,
                bank_account_to: data.general_selection.general_selection.bank_account_to,
                check_number: data.general_selection.general_selection.check_number,
                check_number_to: data.general_selection.general_selection.check_number_to,
                currency: (currencies) ? {
                    _id: currencies._id,
                    name: currencies.name
                } : null,
                currency_to: data.general_selection.general_selection.currency_to,
                amount: data.general_selection.general_selection.amount,
                amount_to: data.general_selection.general_selection.amount_to,
            },
            output_control: {
                list_of_outstanding_checks: data.general_selection.general_selection.output_control.list_of_outstanding_checks,
                additional_heading: data.general_selection.general_selection.output_control.additional_heading,
            },
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated,
    };
};
