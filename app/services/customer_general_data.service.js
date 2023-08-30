const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/customer_general_data.model");

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

exports.getByCode = async (code, existing_id) => {
    const options = { "header.customer_code": code, status: DefaultModel.STATUS_ACTIVE, };

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
        { $match: filters }
    ];
};
exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            customer_code: data.header.customer_code,
            company_code: {
                _id: data.company_code._id,
                code: data.company_code.code,
                description: data.company_code.desc
            },
            account_group: data.header.account_group,
        },
        address: {
            name: {
                title: data.address.name.title,
                name: data.address.name.name,
            },
            search_terms: {
                search_term_1: data.address.search_terms.search_term_1,
                search_term_2: data.address.search_terms.search_term_2,
            },
            street_address: {
                street: data.address.street_address.street,
                house_number: data.address.street_address.house_number,
                postal_code: data.address.street_address.postal_code,
                city: data.address.street_address.city,
                country: data.address.street_address.country,
                region: data.address.street_address.region,
            },
            po_box_address: {
                po_box: data.address.po_box_address.po_box,
                postal_code: data.address.po_box_address.postal_code,
                company_postal_code: data.address.po_box_address.company_postal_code,
            },
            communication: {
                language: data.address.communication.language,
                telephone: data.address.communication.telephone,
                mobile_phone: data.address.communication.mobile_phone,
                fax: data.address.communication.fax,
                email: data.address.communication.email,
            },
        },
        control_data: {
            account_control: {
                customer: (data.control_data.account_control.customer) ? {
                    _id: data.customer._id,
                    name: data.customer.name
                } : null,

                trading_partner: (data.control_data.account_control.trading_partner) ? {
                    _id: data.trading_partner._id,
                    name: data.trading_partner.name
                } : null,

                authorization: (data.control_data.account_control.authorization) ? {
                    _id: data.authorization._id,
                    name: data.authorization.name
                } : null,

                corporate_group: (data.control_data.account_control.corporate_group) ? {
                    _id: data.corporate_group._id,
                    name: data.corporate_group.name
                } : null
            },
            reference_data: {
                location_one: data.control_data.reference_data.location_one,
                location_two: data.control_data.reference_data.location_two,
                check_digit: data.control_data.reference_data.check_digit,
                industry: data.control_data.reference_data.industry,
            },
        },
        payment_transactions: {
            bank_details: data.payment_transactions.bank_details,
        },
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0],
    };
};
