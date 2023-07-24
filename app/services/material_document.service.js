const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/material_document.model");

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
                localField: 'header.company_code',
                foreignField: '_id',
                as: 'company'
            },
        },
        {
            $unwind: {
                path: '$company',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'header.currency',
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

        {
            $lookup: {
                from: 'fiscal_periods',
                localField: 'header.fiscal_year',
                foreignField: '_id',
                as: 'fiscal_year'
            },
        },
        {
            $unwind: {
                path: '$fiscal_year',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'ledger_groups',
                localField: 'header.ledger',
                foreignField: '_id',
                as: 'ledger'
            },
        },
        {
            $unwind: {
                path: '$ledger',
                preserveNullAndEmptyArrays: true
            }
        },

        // ////////////////////////////////////////
        {
            $lookup: {
                from: 'companies',
                localField: 'items.items.company',
                foreignField: '_id',
                as: 'company'
            },
        },

        {
            $lookup: {
                from: 'gl_accounts',
                localField: 'items.items.account',
                foreignField: '_id',
                as: 'account'
            },
        },

        {
            $lookup: {
                from: 'currencies',
                localField: 'items.items.currency',
                foreignField: '_id',
                as: 'currency'
            },
        },
        {
            $lookup: {
                from: 'profit_centers',
                localField: 'items.items.profit_center',
                foreignField: '_id',
                as: 'profit_center'
            },
        },

        {
            $lookup: {
                from: 'segments',
                localField: 'items.items.segment',
                foreignField: '_id',
                as: 'segments'
            },
        },
        {
            $lookup: {
                from: 'posting_keys',
                localField: 'items.items.pk',
                foreignField: '_id',
                as: 'pk'
            },
        },

        { $match: filters }
    ];
};

exports.mapData = (data) => {
    const { vendor, customer, header, company, currency, types, fiscal } = data;


    return {
        _id: data._id,
        header: {
            document_number: data.header.document_number,
            document_date: data.header.document_date,
            reference: data.header.reference,
            currency: (currency) ? {
                _id: currency._id,
                code: currency.code,
                name: currency.name,
            } : null,
            company_code: (company) ? {
                _id: company._id,
                code: company.code,
                name: company.name,
            } : null,
            posting_date: data.header.posting_date,
            cross_cc_no: data.header.cross_cc_no,
            fiscal_year: (fiscal) ? {
                _id: fiscal._id,
                period: fiscal.period,
                name: fiscal.name,
            } : null,
            ledger: (ledger) ? {
                _id: ledger._id,
                code: ledger.code,
                name: ledger.name,
                desc: ledger.desc,
            } : null,
        },
        items: {
            items: data.items.items.map((o) => {
                const itemCompany = data.companies.find(i => (i && i._id && o && o.company) ? (i._id.toString() === o.company.toString()) : false);
                const itemGLAcct = data.gl_accounts.find(i => (i && i._id && o && o.account) ? (i._id.toString() === o.account.toString()) : false);
                const itemCurrency = data.currencies.find(i => (i && i._id && o && o.currency) ? (i._id.toString() === o.currency.toString()) : false);
                const itemTrading = data.trading_partners.find(i => (i && i._id && o && o.trading_part_ba) ? (i._id.toString() === o.trading_part_ba.toString()) : false);
                const itemProfitCenter = data.profit_centers.find(i => (i && i._id && o && o.profit_center) ? (i._id.toString() === o.profit_center.toString()) : false);
                const itemPk = data.transaction_type.find(i => i._id.toString() == o.transaction_type.toString());
                // const itemProfit = data.profit_center.find(i => i._id.toString() == o.profit_center.toString());
                const itemSegment = data.segments.find(i => (i && i._id && o && o.segment) ? (i._id.toString() === o.segment.toString()) : false);


                return {
                    company: (itemCompany) ? {
                        _id: itemCompany._id,
                        code: itemCompany.code,
                        company_name: itemCompany.company_name,
                        desc: itemCompany.desc,
                    } : null,
                    pk: (itemPk) ? {
                        _id: itemPk._id,
                        posting_key_code: itemPk.posting_key_code,
                        name: itemPk.name,
                        type: itemPk.type
                    } : null,
                    account: (itemGLAcct) ? {
                        _id: itemGLAcct._id,
                        header: itemGLAcct.header,
                        type_description: {
                            description: {
                                short_text: itemGLAcct.type_description.description.short_text
                            }
                        }
                    } : null,
                    amount: o.amount,
                    currency: (itemCurrency) ? {
                        _id: itemCurrency._id,
                        code: itemCurrency.code,
                        name: itemCurrency.name,
                    } : null,
                    tax: o.tax,
                    profit_center: (itemProfitCenter) ? {
                        _id: itemProfitCenter._id,
                        profit_center_code: itemProfitCenter.basic_data.description.profit_center_code
                    } : null,
                    segment: (itemSegment) ? {
                        _id: itemSegment._id,
                        code: itemSegment.code,
                        name: itemSegment.name,
                    } : null,
                };
            }),
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated,
    };
};
