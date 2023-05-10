const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/customer_withholding_tax.model");

exports.create = async (data) => {
    const dftModel = await DefaultModel.create(data);

    if (!dftModel) return false;

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
//     const options = { "header.cost_element_code": code, status: DefaultModel.STATUS_ACTIVE, };

//     if (existing_id && existing_id != "")
//         options["_id"] = { $ne: existing_id };

//     return (await DefaultModel.countDocuments(options)) > 0;
// };

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'vendor_general_datas',
                localField: 'header.vendor',
                foreignField: '_id',
                as: 'vendor',
            },
        },
        // if the id is optional or nullable
        { $unwind: '$vendor' },
        {
            $lookup: {
                from: 'companies',
                localField: 'header.company_code',
                foreignField: '_id',
                as: 'company_code',
            },
        },
        { $unwind: '$company_code' },


        { $match: filters },
    ];
};
exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            vendor: {
                _id: data.vendor._id,
                code: data.vendor.header.vendor_code,
                description: data.vendor.header.account_group
            },
            company_code: {
                _id: data.company_code._id,
                code: data.company_code.code,
                description: data.company_code.desc
            },
            wh_tax_country: data.header.wh_tax_country,
        },
        with_tax_information: {
            wth_t_ty: data.with_tax_information.wth_t_ty,
            w_tax_c: data.with_tax_information.w_tax_c,
            w_tax: data.with_tax_information.w_tax,
            oblig_form: data.with_tax_information.oblig_form,
            oblig_to: data.with_tax_information.oblig_to,
            w_tax_number: data.with_tax_information.w_tax_number,
            name: data.with_tax_information.name,
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated,
    };
};
