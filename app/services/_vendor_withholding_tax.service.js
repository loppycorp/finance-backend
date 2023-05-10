const ObjectId = require('mongoose').Types.ObjectId;
const DefaultModel = require('../models/vendor_withholding_tax.model');

exports.create = async (data) => {
    const DefaultModel = await DefaultModel.create(data);

    if (!DefaultModel) return false;

    return await this.get(vendorWithholdingTax._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = DefaultModel.STATUS_INACTIVE;

    const results = await DefaultModel.aggregate(this.pipeline(filters))
    const vendorWithholdingTax = results[0];

    if (!vendorWithholdingTax) return null;

    return this.mapData(vendorWithholdingTax);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const vendorWithholdingTax = await DefaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!vendorWithholdingTax) return false;

    return await this.get(vendorWithholdingTax._id);
};

exports.delete = async (id) => {
    const vendorWithholdingTax = await DefaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: DefaultModel.STATUS_INACTIVE }
    });

    if (!vendorWithholdingTax) return false;

    return await this.get(vendorWithholdingTax._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const vendorWithholdingTaxData = results.map(o => this.mapData(o));

    const vendorWithholdingTaxTotal = await DefaultModel.countDocuments(filters);

    return { data: vendorWithholdingTaxData, total: vendorWithholdingTaxTotal };
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'vendors',
                localField: 'vendor_id',
                foreignField: '_id',
                as: 'vendor_id'
            },
        },
        { $unwind: '$vendor_id' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        vendor_id: data.vendor_id,
        company_code_id: data.company_code_id,
        wh_tax_country: data.wh_tax_country,
        with_tax_information: data.with_tax_information,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    }
};