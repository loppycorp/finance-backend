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
    const { bank_keys, currencies, company_code, house_bank, account_id } = data;

    const generalSelection = data.general_selection && data.general_selection.general_selection
        ? data.general_selection.general_selection
        : {};
    const outputControl = generalSelection.output_control || {};

    return {
        _id: data._id,
        header: {
            paying_company_code: company_code ? {
                _id: company_code._id,
                name: company_code.company_name,
                description: company_code.desc
            } : null,
            paying_company_code_to: data.header ? data.header.paying_company_code : null,
            house_bank: house_bank ? {
                _id: house_bank._id,
                name: house_bank.house_bank_code,
                description: house_bank.address ? house_bank.address.name : null
            } : null,
            house_bank_to: data.header ? data.header.house_bank_to : null,
            account_id: account_id ? {
                _id: account_id._id,
                name: account_id.header ? account_id.header.gl_account_code : null,
                description: account_id.type_description ? account_id.type_description.description.short_text : null
            } : null,
            account_id_to: data.header ? data.header.account_id_to : null,
            payroll_checks: data.header ? data.header.payroll_checks : null,
        },
        general_selection: {
            general_selection: {
                bank_key: bank_keys ? {
                    _id: bank_keys._id,
                    name: bank_keys.details ? bank_keys.details.address.name : null,
                    region: bank_keys.details ? bank_keys.details.address.region : null
                } : null,
                bank_key_to: generalSelection.bank_key_to,
                bank_account: generalSelection.bank_account,
                bank_account_to: generalSelection.bank_account_to,
                check_number: generalSelection.check_number,
                check_number_to: generalSelection.check_number_to,
                currency: currencies ? {
                    _id: currencies._id,
                    name: currencies.name
                } : null,
                currency_to: generalSelection.currency_to,
                amount: generalSelection.amount,
                amount_to: generalSelection.amount_to,
            },
            output_control: {
                list_of_outstanding_checks: outputControl.list_of_outstanding_checks,
                additional_heading: outputControl.additional_heading,
            },
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated,
    };
};

