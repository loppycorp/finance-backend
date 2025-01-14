const ObjectId = require('mongoose').Types.ObjectId;
const DefaultModel = require('../models/vendor_general_data.model');

exports.search = async (searchTerm, options = {}) => {
    const filters = { status: DefaultModel.STATUS_ACTIVE };

    if (searchTerm) {
        const search = new RegExp(options.search, 'i');
        filters.$or = [
            { "header.vendor_code": search },
            { "header.company_code": search },
            { "header.account_group": search },
            { "address.name.title": search },
            { "address.name.name": search },
            { "address.search_terms.search_term_1": search },
            { "address.search_terms.search_term_2": search },
            { "address.street_address.street": search },
            { "address.street_address.house_number": search },
            { "address.street_address.postal_code": search },
            { "address.street_address.city": search },
            { "address.street_address.country": search },
            { "address.street_address.region": search },
            { "address.po_box_address.po_box": search },
            { "address.po_box_address.postal_code": search },
            { "address.po_box_address.company_postal_code": search },
            { "address.communication.language": search },
            { "address.communication.telephone": search },
            { "address.communication.mobile_phone": search },
            { "address.communication.fax": search },
            { "address.communication.email": search },
            { "control_data.account_control.customer": search },
            { "control_data.account_control.trading_partner": search },
            { "control_data.account_control.authorization": search },
            { "control_data.account_control.corporate_group": search },
            { "payment_transactions.bank_details.country": search },
            { "payment_transactions.bank_details.bank_key": search },
            { "payment_transactions.bank_details.bank_account": search },
            { "payment_transactions.bank_details.account_holder": search },
            { "payment_transactions.bank_details.ck": search },
            { "payment_transactions.bank_details.iban_value": search },
            { "payment_transactions.bank_details.bnkt": search },
            { "payment_transactions.bank_details.reference": search },
            { "payment_transactions.payment_transactions.alternative_payee": search },
            { "payment_transactions.payment_transactions.dme_indicator": search },
            { "payment_transactions.payment_transactions.instruction_key": search },
            { "payment_transactions.payment_transactions.isr_number": search },
            { "payment_transactions.alternative_payee.individual_spec": search },
            { "payment_transactions.alternative_payee.spec_reference": search }

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

exports.getByCode = async (code, existing_id) => {
    const options = { "header.vendor_code": code, status: DefaultModel.STATUS_ACTIVE, };

    if (existing_id && existing_id != "")
        options["_id"] = { $ne: existing_id };

    return (await DefaultModel.countDocuments(options)) > 0;
};

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
        { $unwind: '$company_code' },
        {
            $lookup: {
                from: 'vendor_account_groups',
                localField: 'header.account_group',
                foreignField: '_id',
                as: 'account_group'
            },
        },
        {
            $unwind: {
                path: '$account_group',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'customer_general_datas',
                localField: 'control_data.account_control.customer',
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
        {
            $lookup: {
                from: 'trading_partners',
                localField: 'control_data.account_control.trading_partner',
                foreignField: '_id',
                as: 'trading_partner'
            },
        },
        {
            $unwind: {
                path: '$trading_partner',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'authorizations',
                localField: 'control_data.account_control.authorization',
                foreignField: '_id',
                as: 'authorization'
            },
        },
        {
            $unwind: {
                path: '$authorization',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'corporate_groups',
                localField: 'control_data.account_control.corporate_group',
                foreignField: '_id',
                as: 'corporate_group'
            },
        },
        {
            $unwind: {
                path: '$corporate_group',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'bank_keys',
                localField: 'payment_transactions.bank_details.bank_key',
                foreignField: '_id',
                as: 'bank_keys'
            },
        },

        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            vendor_code: data.header.vendor_code,
            company_code: {
                _id: data.company_code._id,
                description: data.company_code.desc
            },
            account_group: (data.header.account_group) ? {
                _id: data.account_group._id
            } : null,
        },
        address: data.address,
        control_data: {
            account_control: {
                customer: (data.control_data.account_control.customer) ? {
                    _id: data.customer._id
                } : null,
                trading_partner: (data.control_data.account_control.trading_partner) ? {
                    _id: data.trading_partner._id
                } : null,
                authorization: (data.control_data.account_control.authorization) ? {
                    _id: data.authorization._id
                } : null,
                corporate_group: (data.control_data.account_control.corporate_group) ? {
                    _id: data.corporate_group._id
                } : null
            }
        },
        payment_transactions: {
            bank_details: data.payment_transactions.bank_details.map((o) => {
                const itemBankKey = data.bank_keys.find(i => i._id.toString() == o.bank_key.toString());

                return {
                    country: o.country,
                    bank_key: (itemBankKey) ?
                        {
                            _id: itemBankKey._id,
                            header: {
                                bank_key_code: itemBankKey.header.bank_key_code
                            },
                            details: {
                                control_data: {
                                    bank_number: itemBankKey.details.control_data.bank_number
                                }
                            }
                        } : null,
                    bank_account: o.bank_account,
                    account_holder: o.account_holder,
                    ck: o.ck,
                    iban_value: o.iban_value,
                    bnkt: o.bnkt,
                    reference: o.reference
                };
            }),

            payment_transactions: data.payment_transactions.payment_transactions,
            alternative_payee: data.payment_transactions.alternative_payee,
        },
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0]
    };
};