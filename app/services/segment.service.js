const ObjectId = require('mongoose').Types.ObjectId;
const Segment = require('../models/segment.model');

exports.create = async (data) => {
    const segment = await Segment.create(data);

    if (!segment) return false;

    return await this.get(segment._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Segment.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Segment.STATUS_INACTIVE;

    const segment = await Segment.findOne(filters);

    if (!segment) return null;

    return this.mapData(segment);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const segment = await Segment.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!segment) return false;

    return await this.get(segment._id);
};

exports.delete = async (id) => {
    const segment = await Segment.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Segment.STATUS_INACTIVE }
    });

    if (!segment) return false;

    return await this.get(segment._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Segment.STATUS_ACTIVE };

    const results = await Segment.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const segmentsData = results.map(o => this.mapData(o));

    const segmentsTotal = await Segment.countDocuments(options);

    return { data: segmentsData, total: segmentsTotal };
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