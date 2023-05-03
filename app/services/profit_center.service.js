const ObjectId = require('mongoose').Types.ObjectId;
const ProfitCenter = require('../models/profit_center.model');

exports.create = async (data) => {
    const profitCenter = await ProfitCenter.create(data);

    if (!profitCenter) return false;

    return await this.get(profitCenter._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: ProfitCenter.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = ProfitCenter.STATUS_INACTIVE;

    const results = await ProfitCenter.aggregate(this.pipeline(filters))
    const profitCenter = results[0];

    if (!profitCenter) return null;

    return this.mapData(profitCenter);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const profitCenter = await ProfitCenter.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!profitCenter) return false;

    return await this.get(profitCenter._id);
};

exports.delete = async (id) => {
    const profitCenter = await ProfitCenter.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: ProfitCenter.STATUS_INACTIVE }
    });

    if (!profitCenter) return false;

    return await this.get(profitCenter._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: ProfitCenter.STATUS_ACTIVE };

    const results = await ProfitCenter.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const profitCenterData = results.map(o => this.mapData(o));

    const profitCenterTotal = await ProfitCenter.countDocuments(filters);

    return { data: profitCenterData, total: profitCenterTotal };
};

exports.getByCode = async (profit_center_code, existing_id) => {
    const options = { profit_center_code: profit_center_code, status: ProfitCenter.STATUS_ACTIVE };

    if (existing_id && existing_id != '')
        options['_id'] = { $ne: existing_id };

    return await ProfitCenter.countDocuments(options) > 0;

};


exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'controlling_areas',
                localField: 'controlling_area_id',
                foreignField: '_id',
                as: 'controlling_area'
            },
        },
        { $unwind: '$controlling_area' },
        {
            $lookup: {
                from: 'users',
                localField: 'basic_data.user_responsible_id',
                foreignField: '_id',
                as: 'user_responsible'
            },
        },
        { $unwind: '$user_responsible' },
        // {
        //     $lookup: {
        //         from: 'users',
        //         localField: 'basic_data.person_responsible_id',
        //         foreignField: '_id',
        //         as: 'person_responsible'
        //     },
        // },
        // { $unwind: '$person_responsible' },
        {
            $lookup: {
                from: 'departments',
                localField: 'basic_data.department_id',
                foreignField: '_id',
                as: 'department'
            },
        },
        { $unwind: '$department' },
        {
            $lookup: {
                from: 'profit_center_groups',
                localField: 'basic_data.profit_ctr_group_id',
                foreignField: '_id',
                as: 'profit_center_group'
            },
        },
        { $unwind: '$profit_center_group' },
        {
            $lookup: {
                from: 'segments',
                localField: 'basic_data.segment_id',
                foreignField: '_id',
                as: 'segment'
            },
        },
        { $unwind: '$segment' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        controlling_area: data.controlling_area,
        description: data.description,
        basic_data: {
            user_responsible: {
                _id: data.user_responsible._id,
                first_name: data.user_responsible.first_name,
                last_name: data.user_responsible.last_name
            },
            person_responsible: data.person_responsible,
            department: data.department,
            profit_ctr_group: data.profit_ctr_group,
            segment: data.segment,
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};