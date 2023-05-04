const ObjectId = require('mongoose').Types.ObjectId;
const defaultModel = require('../models/gl_account_group.model');

exports.create = async (data) => {
    const defaultVariable = await defaultModel.create(data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: defaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = defaultModel.STATUS_INACTIVE;

    const defaultVariable = await defaultModel.findOne(filters);

    if (!defaultVariable) return null;

    return this.mapData(defaultVariable);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const defaultVariable = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};

exports.delete = async (id) => {
    const defaultVariable = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: defaultModel.STATUS_INACTIVE }
    });

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: defaultModel.STATUS_ACTIVE };

    const results = await defaultModel.find(options)
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const Data = results.map(o => this.mapData(o));

    const Total = await defaultModel.countDocuments(options);

    return { data: Data, total: Total };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        charts_of_account: data.charts_of_account,
        account_group: data.account_group,
        name: data.name,
        from_account: data.from_account,
        to_account: data.to_account,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};