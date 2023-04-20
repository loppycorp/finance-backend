const ObjectId = require('mongoose').Types.ObjectId;
const CtrlingArea = require('../models/controlling_area.model');

exports.create = async (data) => {
    const ctrlingArea = await CtrlingArea.create(data);

    if (!ctrlingArea) return false;

    return await this.get(ctrlingArea._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: CtrlingArea.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = CtrlingArea.STATUS_INACTIVE;

    const ctrlingArea = await CtrlingArea.findOne(filters);

    if (!ctrlingArea) return null;

    return this.mapData(ctrlingArea);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const ctrlingArea = await CtrlingArea.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!ctrlingArea) return false;

    return await this.get(ctrlingArea._id);
};

exports.delete = async (id) => {
    const ctrlingArea = await CtrlingArea.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: CtrlingArea.STATUS_INACTIVE }
    });

    if (!ctrlingArea) return false;

    return await this.get(ctrlingArea._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: CtrlingArea.STATUS_ACTIVE };

    const results = await CtrlingArea.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const ctrlingAreasData = results.map(o => this.mapData(o));

    const ctrlingAreasTotal = await CtrlingArea.countDocuments(options);

    return { data: ctrlingAreasData, total: ctrlingAreasTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        name: data.name,
        desc: data.desc,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};