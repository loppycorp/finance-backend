const ObjectId = require('mongoose').Types.ObjectId;
const Assets = require('../models/assets.model');

exports.create = async (data) => {
    const assets = await Assets.create(data);

    if (!assets) return false;

    return await this.get(assets._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Assets.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Assets.STATUS_INACTIVE;

    const assets = await Assets.findOne(filters);

    if (!assets) return null;

    return this.mapData(assets);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const assets = await Assets.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!assets) return false;

    return await this.get(assets._id);
};

exports.delete = async (id) => {
    const assets = await Assets.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Assets.STATUS_INACTIVE }
    });

    if (!assets) return false;

    return await this.get(assets._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: Assets.STATUS_ACTIVE };

    const results = await Assets.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const assetData = results.map(o => this.mapData(o));

    const assetTotal = await ProfitCenter.countDocuments(filters);

    return { data: assetData, total: assetTotal };
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'companies',
                localField: 'company_code_id',
                foreignField: '_id',
                as: 'company'
            },
        },
        { $unwind: '$company' },
        {
            $lookup: {
                from: 'cost_centers',
                localField: 'time_dependent.interval.cost_center_id',
                foreignField: '_id',
                as: 'cost_center'
            },
        },
        { $unwind: '$cost_center' },
        { $match: filters }
    ]
};


exports.mapData = (data) => {
    return {
        _id: data._id,
        asset_class: data.asset_class,
        company_code: data.company_code,
        number_of_similar_assets: data.number_of_similar_assets,
        class: data.class,
        general: data.general,
        time_dependent: data.time_dependent,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};