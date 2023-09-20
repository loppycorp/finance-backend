const ObjectId = require('mongoose').Types.ObjectId;
const DefaultModel = require('../models/vendor_invoice.model');

exports.search = async (searchTerm, options = {}) => {
    const filters = { status: DefaultModel.STATUS_ACTIVE };

    if (searchTerm) {
        const search = new RegExp(options.search, 'i');
        filters.$or = [
            { "header.vendor": search },
            { "header.company_code": search },
            { "header.gl_account": search },
            { "item.title": search },
            { "item.name": search },
            { "item.language_key": search },
            { "item.street": search },
            { "item.po_box": search },
            { "item.po_without_no": search },
            { "item.po_box_pcode": search },
            { "item.city": search },
            { "item.country": search },
            { "item.postal_code": search },
            { "item.region": search },
            { "item.bank_key": search },
            { "item.bank_account": search },
            { "item.reference": search },
            { "item.back_country": search },
            { "item.control_key": search },
            { "item.instruction_key": search },
            { "item.dme_indicator": search },
            { "item.tax_type": search },
            { "item.tax_number_type": search },
            { "item.tax_number1": search },
            { "item.tax_number2": search },
            { "item.tax_number3": search },
            { "item.tax_number4": search },
            { "item.type_of_business": search },
            { "item.type_of_industr": search },
            { "item.natural_person": search },
            { "item.equalizatn_tax": search },
            { "item.liable_for_vat": search },
            { "item.reps_name": search }

        ];
    }

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = DefaultModel.STATUS_INACTIVE;

    const results = await DefaultModel.aggregate(this.pipeline(filters));

    const mappedResults = results.map(result => this.mapData(result));

    return { data: mappedResults, total: mappedResults.length };
};

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

// exports.getByCode = async (code, existing_id) => {
//     const options = { "header.vendor_code": code, status: DefaultModel.STATUS_ACTIVE, };

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
                as: 'vendor'
            },
        },
        { $unwind: '$vendor' },
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
                from: 'gl_accounts',
                localField: 'header.gl_account',
                foreignField: '_id',
                as: 'gl_account'
            },
        },
        { $unwind: '$gl_account' },
        {
            $lookup: {
                from: 'countries',
                localField: 'item.country',
                foreignField: '_id',
                as: 'country'
            },
        },
        { $unwind: '$country' },
        {
            $lookup: {
                from: 'bank_keys',
                localField: 'item.bank_key',
                foreignField: '_id',
                as: 'bank_key'
            },
        },
        {
            $unwind: {
                path: "$bank_key",
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
            vendor: {
                _id: data.vendor._id
            },
            company_code: {
                _id: data.company_code._id
            },
            gl_account: {
                _id: data.gl_account._id
            },
        },
        item: {
            title: data.item.title,
            name: data.item.name,
            language_key: data.item.language_key,
            street: data.item.street,
            po_box: data.item.po_box,
            po_without_no: data.item.po_without_no,
            po_box_pcode: data.item.po_box_pcode,
            city: data.item.city,
            country: {
                _id: data.vendor._id
            },
            postal_code: data.item.postal_code,
            region: data.item.region,
            bank_key: (data.item.bank_key)
                ? {
                    _id: data.bank_key._id,
                } : null,
            bank_account: data.item.bank_account,
            reference: data.item.reference,
            back_country: data.item.back_country,
            control_key: data.item.control_key,
            instruction_key: data.item.instruction_key,
            dme_indicator: data.item.dme_indicator,
            tax_type: data.item.tax_type,
            tax_number_type: data.item.tax_number_type,
            tax_number1: data.item.tax_number1,
            tax_number2: data.item.tax_number2,
            tax_number3: data.item.tax_number3,
            tax_number4: data.item.tax_number4,
            type_of_business: data.item.type_of_business,
            type_of_industr: data.item.type_of_industr,
            natural_person: data.item.natural_person,
            equalizatn_tax: data.item.equalizatn_tax,
            liable_for_vat: data.item.liable_for_vat,
            reps_name: data.item.reps_name,
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};