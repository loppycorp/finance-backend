const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/invoice.model");
const posting_keys = require('../services/posting_key.service');



exports.create = async (data, req) => {

    let totalDeb = 0;
    let totalCred = 0;
    // const balanceStatus = data.balanceStatus;

    // if (balanceStatus == DefaultModel.DOC_BALANCED) {
    //     data['type.document_status'] = DefaultModel.DOC_STATUS_SIMULATE;
    // }

    const doc_type = req.type;
    if (doc_type && doc_type != '') {
        data['type.invoice_code'] = doc_type;
    }

    for (let i = 0; i < data.items.items.length; i++) {
        const item = data.items.items[i];

        const itemsPK = await posting_keys.get(item.transaction_type);

        if (itemsPK.type == DefaultModel.TRANS_TYPE_CREDIT)
            totalCred += parseFloat(item.amount);

        if (itemsPK.type == DefaultModel.TRANS_TYPE_DEBIT)
            totalDeb += parseFloat(item.amount);

        let totalBalance = totalDeb - totalCred;

        data['amount_information.total_credit'] = totalCred;
        data['amount_information.total_debit'] = totalDeb;
        data['amount_information.balance_status'] = (totalBalance == 0) ? DefaultModel.DOC_BALANCED : DefaultModel.DOC_UNBALANCED;

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

exports.getForReport = async (id) => {
    const record = await DefaultModel.findOne({ _id: ObjectId(id) });

    if (record.invoice_status != DefaultModel.DOC_STATUS_COMPLETED) return false;

    if (!record) return false;

    return this.mapData(record[0]);
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: DefaultModel.STATUS_ACTIVE };

    if (query.status && query.status != '') {
        const statuses = query.status.split(',');
        if (statuses.length > 0) {
            filters['type.invoice_status'] = { $in: statuses };
        }
    }

    if (query.type && query.type != '') {
        const statuses = query.type.split(',');
        if (statuses.length > 0) {
            filters['type.invoice_code'] = { $in: statuses };
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
    let totalDeb = 0;
    let totalCred = 0;

    for (let i = 0; i < data.items.items.length; i++) {
        const item = data.items.items[i];

        const itemss = await posting_keys.get(item.transaction_type);

        if (itemss.type == DefaultModel.TRANS_TYPE_CREDIT)
            totalCred += parseFloat(item.amount);

        if (itemss.type == DefaultModel.TRANS_TYPE_DEBIT)
            totalDeb += parseFloat(item.amount);

        let totalBalance = totalDeb - totalCred;

        data['amount_information.total_credit'] = totalCred;
        data['amount_information.total_debit'] = totalDeb;
        data['amount_information.balance_status'] = (totalBalance == 0) ? DefaultModel.DOC_BALANCED : DefaultModel.DOC_UNBALANCED;

    }
    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, { $set: data });

    if (!result) return false;


    return await this.get(result._id);

};

exports.posting = async (id) => {
    const document = await DefaultModel.findOne({ _id: ObjectId(id) });

    if (!document) return false;

    if (document.amount_information.balance_status != DefaultModel.DOC_BALANCED) return false;

    // Generate the document number here
    const documentNumber = await generateDocumentNumber();

    document.header.document_number = documentNumber;
    document.type.invoice_status = DefaultModel.DOC_STATUS_COMPLETED;

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
            'type.invoice_status': doc_status
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
                from: 'vendor_general_datas',
                localField: 'header.vendor',
                foreignField: '_id',
                as: 'vendor'
            },
        },
        {
            $unwind: {
                path: '$vendor',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'customer_general_datas',
                localField: 'header.customer',
                foreignField: '_id',
                as: 'customer'
            },
        },
        {
            $unwind: {
                path: '$customer',
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
    const { vendor, customer, header, company, currency, types } = data;

    // let totalDeb = 0;
    // let totalCred = 0;

    return {
        _id: data._id,
        header: {
            vendor: (data.type.invoice_code == DefaultModel.DOC_TYPE_VENDOR && vendor) ?
                {
                    _id: vendor._id,
                    header: {
                        vendor_code: vendor.header.vendor_code
                    },
                    address: {
                        name: {
                            name: vendor.address.name.name
                        },
                        communication: {
                            telephone: (vendor.address.communication.telephone) ? vendor.address.communication.telephone : '',
                            mobile_phone: (vendor.address.communication.mobile_phone) ? vendor.address.communication.telephone : '',
                            email: (vendor.address.communication.email) ? vendor.address.communication.email : ''
                        }
                    }
                } : undefined,
            customer: (data.type.invoice_code == DefaultModel.DOC_TYPE_CUSTOMER && customer) ?
                {
                    _id: customer._id,
                    header: {
                        customer_code: customer.header.customer_code
                    },
                    address: {
                        name: {
                            name: customer.address.name.name
                        },
                        communication: {
                            telephone: (customer.address.communication.telephone) ? customer.address.communication.telephone : '',
                            mobile_phone: (customer.address.communication.mobile_phone) ? customer.address.communication.telephone : '',
                            email: (customer.address.communication.email) ? customer.address.communication.email : ''
                        }
                    }
                } : undefined,

            // vendor: {
            //     _id: vendor._id,
            //     header: {
            //         vendor_code: vendor.header.vendor_code
            //     },
            //     address: {
            //         name: {
            //             name: vendor.address.name.name
            //         },
            //         communication: {
            //             telephone: (vendor.address.communication.telephone) ? vendor.address.communication.telephone : '',
            //             mobile_phone: (vendor.address.communication.mobile_phone) ? vendor.address.communication.telephone : '',
            //             email: (vendor.address.communication.email) ? vendor.address.communication.email : ''
            //         }
            //     },
            //     payment_transactions: {
            //         bank_details: [
            //             {
            //                 bank_key: (vendor.payment_transactions.bank_details.bank_key)
            //                     ? {
            //                         bank_number: vendor.details.control_data.bank_number
            //                     } : null,
            //                 bank_account: (vendor.payment_transactions.bank_details.bank_account)
            //                     ? vendor.payment_transactions.bank_details.bank_account : null
            //             }
            //         ]
            //     }
            // },
            document_number: (header.document_number) ? header.document_number : 'Not yet posted',
            invoice_date: header.invoice_date,
            posting_date: header.posting_date,
            document_type: (types) ? {
                _id: types._id,
                code: types.code,
                name: types.name,
            } : null,
            company_code: (company) ? {
                _id: company._id,
                code: company.code,
                name: company.name,
            } : null,

            cross_cc_no: header.cross_cc_no,
            business_place: header.business_place,
            section: header.section,
            text: header.text,
            sgl_ind: header.sgl_ind,
            reference: header.reference,
            currency: (currency) ? {
                _id: currency._id,
                code: currency.code,
                name: currency.name,
            } : null,
            calculate_tax: header.calculate_tax

        },
        items: {
            items: data.items.items.map((o) => {
                const itemGLAcct = data.gl_accounts.find(i => i._id.toString() == o.gl_account.toString());
                const itemTrading = data.trading_partners.find(i => i._id.toString() == o.trading_part_ba.toString());
                const itemCostCenter = data.cost_centers.find(i => i._id.toString() == o.cost_center.toString());
                const itemPk = data.transaction_type.find(i => i._id.toString() == o.transaction_type.toString());
                // const itemProfit = data.profit_center.find(i => i._id.toString() == o.profit_center.toString());
                const itemSegment = data.segment.find(i => i._id.toString() == o.segment.toString());

                return {
                    gl_account: {
                        _id: itemGLAcct._id,
                        header: itemGLAcct.header,
                        type_description: {
                            description: {
                                short_text: itemGLAcct.type_description.description.short_text
                            }
                        }
                    },
                    transaction_type: (itemPk) ? {
                        _id: itemPk._id,
                        posting_key_code: itemPk.posting_key_code,
                        name: itemPk.name,
                        type: itemPk.type
                    } : null,
                    amount: o.amount,
                    tax_amount: o.tax_amount,
                    trading_part_ba: (itemTrading) ? {
                        _id: itemTrading._id,
                        code: itemTrading.code,
                        name: itemTrading.name,
                    } : null,
                    segment: (itemSegment) ? {
                        _id: itemSegment._id,
                        code: itemSegment.code,
                        name: itemSegment.name,
                    } : null,

                    cost_center: {
                        _id: itemCostCenter._id,
                        cost_center_code: itemCostCenter.cost_center_code
                    },
                    tax: o.tax,
                };
            }),
        },
        type: data.type,
        amount_information: data.amount_information,
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
