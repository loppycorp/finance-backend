const ObjectId = require('mongoose').Types.ObjectId;
const CorporateGroup = require('../models/trading_partner.model');

exports.create = async (data) => {
    const corporateGroup = await CorporateGroup.create(data);

    if (!corporateGroup) return false;

    return await this.get(corporateGroup._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: CorporateGroup.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = CorporateGroup.STATUS_INACTIVE;

    const corporateGroup = await CorporateGroup.findOne(filters);

    if (!corporateGroup) return null;

    return this.mapData(corporateGroup);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const corporateGroup = await CorporateGroup.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!corporateGroup) return false;

    return await this.get(corporateGroup._id);
};

exports.delete = async (id) => {
    const corporateGroup = await CorporateGroup.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: CorporateGroup.STATUS_INACTIVE }
    });

    if (!corporateGroup) return false;

    return await this.get(corporateGroup._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: CorporateGroup.STATUS_ACTIVE };

    const results = await CorporateGroup.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const corporateGroupData = results.map(o => this.mapData(o));

    const corporateGroupTotal = await CorporateGroup.countDocuments(options);

    return { data: corporateGroupData, total: corporateGroupTotal };
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