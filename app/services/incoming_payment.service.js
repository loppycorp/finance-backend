const ObjectId = require('mongoose').Types.ObjectId;
const DefaultModel = require('../models/incoming_payment.model');

exports.create = async (data) => {
    const defaultVariable = await DefaultModel.create(data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};
exports.get = async (id, options = {}) => {
    const record = await DefaultModel.aggregate(this.pipeline({
        _id: ObjectId(id),
        status: (options.display_inactive === true)
            ? DefaultModel.STATUS_INACTIVE
            : DefaultModel.STATUS_ACTIVE
    }));

    if (!record[0]) return false;

    return this.mapData(record[0]);
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
                from: 'companies',
                localField: 'header.company_code',
                foreignField: '_id',
                as: 'company_code'
            },
        },
        {
            $unwind: {
                path: "$company_code",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'profit_centers',
                localField: 'bank_data.profit_center',
                foreignField: '_id',
                as: 'profit_center'
            },
        },
        {
            $unwind: {
                path: "$profit_center",
                preserveNullAndEmptyArrays: true
            }
        },

    ]
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            document_date: data.header.document_date,
            posting_date: data.header.posting_date,
            document_number: data.header.document_number,
            reference: data.header.reference,
            doc_header_text: data.header.doc_header_text,
            clearing_text: data.header.clearing_text,
            trading_part_ba: data.header.trading_part_ba,
            type: data.header.type,
            period: data.header.period,
            company_code: (data.header.company_code) ? {
                _id: data.company_code._id,
                code: data.company_code.code,
                description: data.company_code.desc
            } : null,
            currency_rate: data.header.currency_rate,
            translatn_date: data.header.translatn_date,
            cross_cc_no: data.header.cross_cc_no,
        },
        bank_data: {
            account: data.bank_data.account,
            amount: data.bank_data.amount,
            bank_charges: data.bank_data.bank_charges,
            value_date: data.bank_data.value_date,
            text: data.bank_data.text,
            business_area: data.bank_data.business_area,
            amount_lc: data.bank_data.amount_lc,
            lc_bank_charges: data.bank_data.lc_bank_charges,
            profit_center: (data.bank_data.profit_center) ? {
                _id: data.profit_center._id
            } : null,
            assignment: data.bank_data.assignment,
        },
        open_item_selection: data.open_item_selection,
        additional_selections: data.additional_selections,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};