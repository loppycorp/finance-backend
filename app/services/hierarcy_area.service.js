const ObjectId = require('mongoose').Types.ObjectId;
const HierarcyArea = require('../models/hierarcy_area.model');

exports.create = async (data) => {
    const hierarcyArea = await HierarcyArea.create(data);

    if (!hierarcyArea) return false;

    return await this.get(hierarcyArea._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: HierarcyArea.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = HierarcyArea.STATUS_INACTIVE;

    const hierarcyArea = await HierarcyArea.findOne(filters);

    if (!hierarcyArea) return null;

    return this.mapData(hierarcyArea);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const hierarcyArea = await HierarcyArea.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!hierarcyArea) return false;

    return await this.get(hierarcyArea._id);
};

exports.delete = async (id) => {
    const hierarcyArea = await HierarcyArea.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: HierarcyArea.STATUS_INACTIVE }
    });

    if (!hierarcyArea) return false;

    return await this.get(hierarcyArea._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: HierarcyArea.STATUS_ACTIVE };

    const results = await HierarcyArea.find(options)
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const hierarcyAreaData = results.map(o => this.mapData(o));

    const hierarcyAreaTotal = await HierarcyArea.countDocuments(options);

    return { data: hierarcyAreaData, total: hierarcyAreaTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        code: data.code,
        name: data.name,
        description: data.description,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};