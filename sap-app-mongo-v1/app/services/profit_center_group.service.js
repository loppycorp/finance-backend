const ObjectId = require('mongoose').Types.ObjectId;
const ProfitCtrGrp = require('../models/profit_center_group.model');

exports.create = async (data) => {
    const profitCtrGrp = await ProfitCtrGrp.create(data);

    if (!profitCtrGrp) return false;

    return await this.get(profitCtrGrp._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: ProfitCtrGrp.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = ProfitCtrGrp.STATUS_INACTIVE;

    const profitCtrGrp = await ProfitCtrGrp.findOne(filters);

    if (!profitCtrGrp) return null;

    return this.mapData(profitCtrGrp);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const profitCtrGrp = await ProfitCtrGrp.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!profitCtrGrp) return false;

    return await this.get(profitCtrGrp._id);
};

exports.delete = async (id) => {
    const profitCtrGrp = await ProfitCtrGrp.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: ProfitCtrGrp.STATUS_INACTIVE }
    });

    if (!profitCtrGrp) return false;

    return await this.get(profitCtrGrp._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: ProfitCtrGrp.STATUS_ACTIVE };

    const results = await ProfitCtrGrp.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const profitCtrGroupsData = results.map(o => this.mapData(o));

    const profitCtrGroupsTotal = await ProfitCtrGrp.countDocuments(options);

    return { data: profitCtrGroupsData, total: profitCtrGroupsTotal };
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