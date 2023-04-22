const ObjectId = require('mongoose').Types.ObjectId;
const fieldstatusgroup = require('../models/valuation_group.model');

exports.create = async (data) => {
    const fieldstatusgroup = await fieldstatusgroup.create(data);

    if (!fieldstatusgroup) return false;

    return await this.get(fieldstatusgroup._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: fieldstatusgroup.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = fieldstatusgroup.STATUS_INACTIVE;

    const fieldstatusgroup = await fieldstatusgroup.findOne(filters);

    if (!fieldstatusgroup) return null;

    return this.mapData(fieldstatusgroup);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const fieldstatusgroup = await fieldstatusgroup.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!fieldstatusgroup) return false;

    return await this.get(fieldstatusgroup._id);
};

exports.delete = async (id) => {
    const fieldstatusgroup = await fieldstatusgroup.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: fieldstatusgroup.STATUS_INACTIVE }
    });

    if (!fieldstatusgroup) return false;

    return await this.get(fieldstatusgroup._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: fieldstatusgroup.STATUS_ACTIVE };

    const results = await fieldstatusgroup.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const fieldstatusgroupsData = results.map(o => this.mapData(o));

    const fieldstatusgroupsTotal = await fieldstatusgroup.countDocuments(options);

    return { data: fieldstatusgroupsData, total: fieldstatusgroupsTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        group_code: data.group_code,
        group_name: data.group_name,
        desc: data.desc,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};