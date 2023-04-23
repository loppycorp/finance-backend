const ObjectId = require('mongoose').Types.ObjectId;
const CostCenter = require('../models/cost_center.model');

exports.create = async (data) => {
    const costCenter = await CostCenter.create(data);

    if (!costCenter) return false;

    return await this.get(costCenter._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: CostCenter.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = CostCenter.STATUS_INACTIVE;

    const results = await CostCenter.aggregate(this.pipeline(filters))
    const costCenter = results[0];

    if (!costCenter) return null;

    return this.mapData(costCenter);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const costCenter = await CostCenter.findByIdAndUpdate({ _id: ObjectId(id) }, { $set: data });
    console.log(costCenter);
    if (!costCenter) return false;

    return await this.get(costCenter._id);
};

exports.delete = async (id) => {
    const costCenter = await CostCenter.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: CostCenter.STATUS_INACTIVE }
    });

    if (!costCenter) return false;

    return await this.get(costCenter._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: CostCenter.STATUS_ACTIVE };

    const results = await CostCenter.aggregate(this.pipeline(filters))
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const costCenterData = results.map(o => this.mapData(o));

    const costCenterTotal = await CostCenter.countDocuments(filters);

    return { data: costCenterData, total: costCenterTotal };
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
        {
            $lookup: {
                from: 'users',
                localField: 'basic_data.person_responsible_id',
                foreignField: '_id',
                as: 'person_responsible'
            },
        },
        { $unwind: '$person_responsible' },
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
                from: 'cost_center_catergories',
                localField: 'basic_data.cost_ctr_category_id',
                foreignField: '_id',
                as: 'cost_center_category'
            },
        },
        { $unwind: '$cost_center_category' },
        {
            $lookup: {
                from: 'hierarcy_areas',
                localField: 'basic_data.hierarchy_area_id',
                foreignField: '_id',
                as: 'hierarchy_area'
            },
        },
        { $unwind: '$hierarchy_area' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        code: data.code,
        controlling_area: data.controlling_area,
        valid_range: data.valid_range,
        names: data.names,
        basic_data: {
            user_responsible: {
                _id: data.user_responsible._id,
                first_name: data.user_responsible.first_name,
                last_name: data.user_responsible.last_name
            },
            person_responsible: {
                _id: data.person_responsible._id,
                first_name: data.person_responsible.first_name,
                last_name: data.person_responsible.last_name
            },
            department:  data.department,
            cost_ctr_category:  data.cost_ctr_category,
            hierarchy_area:  data.hierarchy_area,
            company:  data.company,
            business_area:  data.business_area,
            functional_area: data.functional_area,
            currency: data.currency,
            profit_center: data.profit_center
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};