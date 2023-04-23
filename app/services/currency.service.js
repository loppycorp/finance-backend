const ObjectId = require('mongoose').Types.ObjectId;
const Currency = require('../models/currency.model');

exports.create = async (data) => {
    const currency = await Currency.create(data);

    if (!currency) return false;

    return await this.get(currency._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Currency.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Currency.STATUS_INACTIVE;

    const currency = await Currency.findOne(filters);

    if (!currency) return null;

    return this.mapData(currency);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const currency = await Currency.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!currency) return false;

    return await this.get(currency._id);
};

exports.delete = async (id) => {
    const currency = await Currency.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Currency.STATUS_INACTIVE }
    });

    if (!currency) return false;

    return await this.get(currency._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Currency.STATUS_ACTIVE };

    const results = await Currency.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const currencyData = results.map(o => this.mapData(o));

    const currencyTotal = await Currency.countDocuments(options);

    return { data: currencyData, total: currencyTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        code: data.code,
        name: data.name,
        desc: data.desc,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};