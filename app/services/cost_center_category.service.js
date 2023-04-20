const ObjectId = require('mongoose').Types.ObjectId;
const CostCenterCatrgory = require('../models/cost_center_category.model');

exports.create = async (data) => {
    const cstCtrCat = await CostCenterCatrgory.create(data);

    if (!cstCtrCat) return false;

    return await this.get(cstCtrCat._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: CostCenterCatrgory.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = CostCenterCatrgory.STATUS_INACTIVE;

    const cstCtrCat = await CostCenterCatrgory.findOne(filters);

    if (!cstCtrCat) return null;

    return this.mapData(cstCtrCat);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const cstCtrCat = await CostCenterCatrgory.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!cstCtrCat) return false;

    return await this.get(cstCtrCat._id);
};

exports.delete = async (id) => {
    const cstCtrCat = await CostCenterCatrgory.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: CostCenterCatrgory.STATUS_INACTIVE }
    });

    if (!cstCtrCat) return false;

    return await this.get(cstCtrCat._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: CostCenterCatrgory.STATUS_ACTIVE };

    const results = await CostCenterCatrgory.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const cstCtrCatData = results.map(o => this.mapData(o));

    const cstCtrCatTotal = await CostCenterCatrgory.countDocuments(options);

    return { data: cstCtrCatData, total: cstCtrCatTotal };
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