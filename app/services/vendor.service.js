const ObjectId = require('mongoose').Types.ObjectId;
const Vendor = require('../models/vendor.model');

exports.create = async (data) => {
    const vendor = await Vendor.create(data);

    if (!vendor) return false;

    return await this.get(vendor._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Vendor.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Vendor.STATUS_INACTIVE;

    const results = await Vendor.aggregate(this.pipeline(filters))
    const vendor = results[0];

    if (!vendor) return null;

    return this.mapData(vendor);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const vendor = await Vendor.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!vendor) return false;

    return await this.get(vendor._id);
};

exports.delete = async (id) => {
    const vendor = await Vendor.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Vendor.STATUS_INACTIVE }
    });

    if (!vendor) return false;

    return await this.get(vendor._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: Vendor.STATUS_ACTIVE };

    const results = await Vendor.aggregate(this.pipeline(filters))
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const vendorData = results.map(o => this.mapData(o));

    const vendorTotal = await Vendor.countDocuments(filters);

    return { data: vendorData, total: vendorTotal };
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'controlling_areas',
                localField: 'controlling_area_id',
                foreignField: '_id',
                as: 'controlling_area'
            },
        },
        { $unwind: '$controlling_area' },
        {
            $lookup: {
                from: 'customers',
                localField: 'account_control.customer_id',
                foreignField: '_id',
                as: 'customer'
            },
        },
        { $unwind: '$customer' },
        {
            $lookup: {
                from: 'trading_partners',
                localField: 'account_control.trading_partner_id',
                foreignField: '_id',
                as: 'trading_partner'
            },
        },
        { $unwind: '$trading_partner' },
        {
            $lookup: {
                from: 'authorizations',
                localField: 'account_control.authorization_id',
                foreignField: '_id',
                as: 'authorization'
            },
        },
        { $unwind: '$authorization' },
        {
            $lookup: {
                from: 'corporate_groups',
                localField: 'account_control.corporate_group_id',
                foreignField: '_id',
                as: 'corporate_group'
            },
        },
        { $unwind: '$corporate_group' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        vendor_code: data.vendor_code, 
    company_code_id: data.company_code_id,
    account_group: data.account_group,
    name: {
        title: data.title,
        name: data.name,
    },
    search_terms: {
        search_term_1: data.search_term_1,
        search_term_2: data.search_term_2,
    },
    street_address: {
        street: data.street,
        house_number: data.house_number,
        postal_code: data.postal_code,
        city: data.city,
        country: data.country,
        region: data.region,
    },
    po_box_address: {
        po_box: data.po_box,
        postal_code: data.postal_code,
        company_postal_code: data.company_postal_code
    },
    communication: {
        language: data.language,
        telephone: data.telephone,
        mobile_phone: data.mobile_phone,
        fax: data.fax,
        email: data.email,
    },
    account_control: {
        customer_id: data.customer_id,
        trading_partner_id: data.trading_partner_id,
        authorization_id: data.authorization_id,
        corporate_group_id: data.corporate_group_id,
    },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};