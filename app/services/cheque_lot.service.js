const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/cheque_lot.model");
const CLRModel = require("../models/cheque_lot_reference.model");

// exports.create = async (data) => {
//     const dftModel = await DefaultModel.create(data);

//     if (!dftModel) return false;

//     return await this.get(dftModel._id);
// };
exports.create = async (data) => {
    const dftModel = await DefaultModel.create(data);
    const { cheque_number_from, cheque_number_to } = data.lot.lot;
    const rows = [];

    for (let i = cheque_number_from; i <= cheque_number_to; i++) {
        const row = {
            cheque_id: data._id,
            cheque_lot: data.lot_number,
            cheque_number: data.cheque_number_from
        };

        rows.push(row);
    }

    const createdRows = await CLRModel.create(rows);

    if (!createdRows) return false;
    return await this.get(dftModel._id);

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

    const dftModel = await DefaultModel.findByIdAndUpdate(
        { _id: ObjectId(id) },
        data
    );

    if (!dftModel) return false;

    return await this.get(dftModel._id);
};
exports.delete = async (id) => {
    const dftModel = await DefaultModel.findByIdAndUpdate(
        { _id: ObjectId(id) },
        {
            $set: { status: DefaultModel.STATUS_INACTIVE },
        }
    );

    if (!dftModel) return false;

    return await this.get(dftModel._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(options))
        .collation({ locale: "en" })
        .sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
        .limit(pageLimit);

    const dftModelData = results.map((o) => this.mapData(o));

    const dftModelTotal = await DefaultModel.countDocuments(options);

    return { data: dftModelData, total: dftModelTotal };
};

// exports.getByCode = async (code, existing_id) => {
//     const options = { "lot.lot.cheque_from", "lot.lot.cheque_to": code, status: DefaultModel.STATUS_ACTIVE, };

//     if (existing_id && existing_id != "")
//         options["_id"] = { $ne: existing_id };

//     return (await DefaultModel.countDocuments(options)) > 0;
// };
exports.checkIfCodeExists = async (cheque_from, cheque_to, existing_id) => {
    const options = {
        'lot.lot.cheque_number_from': { $lte: cheque_to },
        'lot.lot.cheque_number_to': { $gte: cheque_from },
        status: DefaultModel.STATUS_ACTIVE,
    };

    if (existing_id && existing_id !== '') {
        options._id = { $ne: existing_id };
    }

    return (await DefaultModel.countDocuments(options)) > 0;
};

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
        { $unwind: '$paying_company_code' },

        {
            $lookup: {
                from: 'house_banks',
                localField: 'header.house_bank',
                foreignField: '_id',
                as: 'house_bank'
            },
        },
        { $unwind: '$house_bank' },

        {
            $lookup: {
                from: 'gl_accounts',
                localField: 'header.gl_account',
                foreignField: '_id',
                as: 'gl_account'
            },
        },
        {
            $unwind: {
                path: '$gl_account',
                preserveNullAndEmptyArrays: true
            }
        },

        { $match: filters }
    ];
};
exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            paying_company_code: {
                _id: data.paying_company_code._id,
                code: data.paying_company_code.code,
                description: data.paying_company_code.desc
            },
            house_bank: {
                _id: data.house_bank._id,
                code: data.house_bank.header.house_bank_code,
                description: data.house_bank.address.name
            },
            gl_account: {
                _id: data.gl_account._id,
                code: data.gl_account.header.gl_account_code,
                description: data.gl_account.type_description.description.short_text
            },
        },
        lot: {
            lot: {
                lot_number: data.lot.lot.lot_number,
                cheque_number_from: data.lot.lot.cheque_number_from,
                cheque_number_to: data.lot.lot.cheque_number_to,
            },
            control_data: {
                next_lot_number: data.lot.control_data.next_lot_number,
                pmnt_meths_list: data.lot.control_data.pmnt_meths_list,
                non_sequential: data.lot.control_data.non_sequential,
            },
            additional_information: {
                short_info: data.lot.additional_information.short_info,
                purchase_date: data.lot.additional_information.purchase_date,
            },
        },
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0],
    };
};
