const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/document_data.model");


exports.create = async (data, req) => {

    const balanceStatus = data.balanceStatus;

    if (balanceStatus == DefaultModel.DOC_BALANCED) {
        data['type.document_status'] = DefaultModel.DOC_STATUS_SIMULATE;
    }

    const doc_type = req.type;
    if (doc_type && doc_type != '') {
        data['type.document_code'] = doc_type;
    }

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

    if (query.status && query.status != '') {
        const statuses = query.status.split(',');
        if (statuses.length > 0) {
            filters['type.document_status'] = { $in: statuses };
        }
    }

    if (query.type && query.type != '') {
        const statuses = query.type.split(',');
        if (statuses.length > 0) {
            filters['type.document_code'] = { $in: statuses };
        }
    }

    const results = await DefaultModel.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);


    console.log(filters)
    const data = results.map(o => this.mapData(o));

    const total = await DefaultModel.countDocuments(filters);

    return { data, total };
};

exports.update = async (id, data) => {
    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, { $set: data });

    if (!result) return false;

    return await this.get(result._id);
};

exports.posting = async (id) => {
    const document = await DefaultModel.findOne({ _id: ObjectId(id) });

    if (!document) return false;

    // Generate the document number here
    const documentNumber = await generateDocumentNumber();

    document.header.document_number = documentNumber;
    document.type.document_status = DefaultModel.DOC_STATUS_COMPLETED;

    const result = await document.save();

    if (!result) return false;

    return await this.get(result._id);
};


exports.delete = async (id) => {
    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, {
        $set: {
            status: DefaultModel.STATUS_INACTIVE
        }
    });

    if (!result) return false;

    return await this.get(result._id, { display_inactive: true });
};

exports.updateStatus = async (id, query) => {

    const doc_status = query.status

    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, {
        $set: {
            'type.document_status': doc_status
        }
    });

    if (!result) return false;

    return await this.get(result._id);
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
                from: 'reversal_reasons',
                localField: 'header.reversal_reason',
                foreignField: '_id',
                as: 'reason'
            },
        },
        {
            $unwind: {
                path: '$reason',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'ledger_groups',
                localField: 'header.ledger_group',
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
        {
            $lookup: {
                from: 'document_types',
                localField: 'header.types',
                foreignField: '_id',
                as: 'types'
            },
        },
        {
            $unwind: {
                path: '$types',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'fiscal_periods',
                localField: 'header.period',
                foreignField: '_id',
                as: 'period'
            },
        },
        {
            $unwind: {
                path: '$period',
                preserveNullAndEmptyArrays: true
            }
        },





        // ////////////////////////////////////////
        {
            $lookup: {
                from: 'gl_accounts',
                localField: 'items.items.gl_account',
                foreignField: '_id',
                as: 'gl_accounts'
            },
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'items.items.company_code',
                foreignField: '_id',
                as: 'companies'
            },
        },
        {
            $lookup: {
                from: 'trading_partners',
                localField: 'items.items.trading_part_ba',
                foreignField: '_id',
                as: 'trading_partners'
            },
        },
        {
            $lookup: {
                from: 'cost_centers',
                localField: 'items.items.cost_center',
                foreignField: '_id',
                as: 'cost_centers'
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
                as: 'segment'
            },
        },
        {
            $lookup: {
                from: 'posting_keys',
                localField: 'items.items.transaction_type',
                foreignField: '_id',
                as: 'transaction_type'
            },
        },

        { $match: filters }
    ];
};

exports.mapData = (data) => {
    const { header, company, currency, types, reason, period, ledger } = data;

    let totalDeb = 0;
    let totalCred = 0;

    return {
        _id: data._id,
        header: {
            document_date: header.document_date,
            document_number: header.document_number,
            posting_date: header.posting_date,
            reference: (header.reference) ? header.reference : '',
            doc_header_text: (header.doc_header_text) ? header.doc_header_text : '',
            cross_cc_no: (header.cross_cc_no) ? header.cross_cc_no : '',
            company_code: (company) ? {
                _id: company._id,
                code: company.code,
                name: company.name,
            } : null,
            currency: (currency) ? {
                _id: currency._id,
                code: currency.code,
                name: currency.name,
            } : null,

            reversal_reason: (reason) ? {
                _id: reason._id,
                code: reason.code,
                name: reason.name,
            } : null,
            reversal_date: data.header.reversal_date,
            ledger_group: (ledger) ? {
                _id: ledger._id,
                code: ledger.code,
                name: ledger.name,
            } : null,
            types: (types) ? {
                _id: types._id,
                description: types.description,
                document_type_code: types.document_type_code,
                reverse_type: types.reverse_type,
                account_types: types.account_types,
            } : null,
            translation_date: data.header.translation_date,
            fiscal_year: data.header.fiscal_year,
            period: (period) ? {
                _id: period._id,
                code: period.code,
                name: period.name,
            } : null,
        },
        items: {
            items: data.items.items.map((o) => {
                const itemGLAcct = data.gl_accounts.find(i => i._id.toString() == o.gl_account.toString());
                const itemCompany = data.companies.find(i => i._id.toString() == o.company_code.toString());
                const itemTrading = data.trading_partners.find(i => i._id.toString() == o.trading_part_ba.toString());
                const itemCostCenter = data.cost_centers.find(i => i._id.toString() == o.cost_center.toString());
                const itemPk = data.transaction_type.find(i => i._id.toString() == o.transaction_type.toString());
                const itemProfit = data.profit_center.find(i => i._id.toString() == o.profit_center.toString());
                const itemSegment = data.segment.find(i => i._id.toString() == o.segment.toString());

                if (itemPk.type == DefaultModel.TRANS_TYPE_CREDIT)
                    totalCred += parseFloat(o.amount);

                if (itemPk.type == DefaultModel.TRANS_TYPE_DEBIT)
                    totalDeb += parseFloat(o.amount);

                let totalBalance = totalDeb - totalCred;

                if (totalBalance == 0)
                    balanceStatus = DefaultModel.DOC_BALANCED;

                if (totalBalance != 0)
                    balanceStatus = DefaultModel.DOC_UNBALANCED;

                return {
                    gl_account: {
                        _id: itemGLAcct._id,
                        header: itemGLAcct.header,
                    },
                    amount_in_doc_curr: o.amount_in_doc_curr,
                    company_code: {
                        _id: itemCompany._id,
                        code: itemCompany.code,
                        desc: itemCompany.desc,
                    },
                    trading_part_ba: (itemTrading) ? {
                        _id: itemTrading._id,
                        code: itemTrading.code,
                        name: itemTrading.name,
                    } : null,
                    bussiness_place: o.bussiness_place,
                    partner: o.partner,
                    cost_center: {
                        _id: itemCostCenter._id,
                        cost_center_code: itemCostCenter.cost_center_code
                    },
                    //added from accrual
                    transaction_type: (itemPk) ? {
                        _id: itemPk._id,
                        code: itemPk.posting_key_code,
                        name: itemPk.name,
                        type: itemPk.type
                    } : null,
                    description: o.description,
                    amount: o.amount,
                    tax: o.tax,
                    profit_center: (itemProfit) ? {
                        _id: itemProfit._id,
                        basic_data: {
                            description: itemProfit.basic_data.description
                        }
                    } : null,
                    segment: (itemSegment) ? {
                        _id: itemSegment._id,
                        name: itemSegment.name
                    } : null,

                };
            }),
        },
        amount_information: {
            total_deb: totalDeb,
            total_cred: totalCred,
            balance_status: balanceStatus
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};


// Helper function to generate the document number
async function generateDocumentNumber() {
    // Find the highest existing document number
    const highestNumberDoc = await DefaultModel.findOne(
        { 'header.document_number': { $ne: null } },
        {},
        { sort: { 'header.document_number': -1 } }
    );

    const highestNumber = highestNumberDoc ? highestNumberDoc.header.document_number : 0;
    const newNumber = highestNumber + 1;

    return newNumber;
}
