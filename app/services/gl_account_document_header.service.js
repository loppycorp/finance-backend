const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/gl_account_document_header.model");

exports.create = async (data) => {
    const result = await DefaultModel.create(data);

    if (!result) return false;

    return await this.get(result._id);
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

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const data = results.map(o => this.mapData(o));

    const total = await DefaultModel.countDocuments(filters);

    return { data, total };
};

exports.update = async (id, data) => {
    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, { $set: data });

    if (!result) return false;

    return await this.get(result._id);
};

exports.delete = async (id, data) => {
    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, { $set: { 
        status: DefaultModel.STATUS_INACTIVE 
    } });

    if (!result) return false;

    return await this.get(result._id, { display_inactive: true });
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'document_types',
                localField: 'type',
                foreignField: '_id',
                as: 'document_type'
            },
        },
        { $unwind: '$document_type' },
        {
            $lookup: {
                from: 'companies',
                localField: 'company',
                foreignField: '_id',
                as: 'company'
            },
        },
        { $unwind: '$company' },
        {
            $lookup: {
                from: 'fiscal_periods',
                localField: 'period',
                foreignField: '_id',
                as: 'period'
            },
        },
        {
            $unwind: { path: "$period", preserveNullAndEmptyArrays: false }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'currency',
                foreignField: '_id',
                as: 'currency'
            },
        },
        { $unwind: '$currency' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,

        posting_date: data.posting_date,
        period: data.period,
        currency: data.currency,
        currency_rate: data.currency_rate,
    
        doc_number: data.doc_number,
        translatn_date: data.translatn_date,
        reference: data.reference,
        cross_cc_no: data.cross_cc_no,
    
        doc_header_text: data.doc_header_text,
        trading_part_ba: data.trading_part_ba,

        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};