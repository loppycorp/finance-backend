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

    console.log(this.pipeline(filters));

    const results = await CostCenter.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const costCenterData = results.map(o => this.mapData(o));

    const costCenterTotal = await CostCenter.countDocuments(filters);

    return { data: costCenterData, total: costCenterTotal };
};

exports.getByCode = async (cost_center_code, existing_id) => {
    const options = { 'header.cost_center_code': cost_center_code, status: CostCenter.STATUS_ACTIVE };

    if (existing_id && existing_id != '')
        options['_id'] = { $ne: existing_id };

    return await CostCenter.countDocuments(options) > 0;

};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'controlling_areas',
                localField: 'header.controlling_area',
                foreignField: '_id',
                as: 'controlling_area'
            },
        },
        { $unwind: '$controlling_area' },
        {
            $lookup: {
                from: 'users',
                localField: 'basic_data.basic_data.user_responsible',
                foreignField: '_id',
                as: 'user_responsible'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: "$user_responsible",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'departments',
                localField: 'basic_data.basic_data.department',
                foreignField: '_id',
                as: 'department'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: "$department",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'cost_center_catergories',
                localField: 'basic_data.basic_data.cost_ctr_category',
                foreignField: '_id',
                as: 'cost_ctr_category'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: "$cost_ctr_category",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'hierarcy_areas',
                localField: 'basic_data.basic_data.hierarchy_area',
                foreignField: '_id',
                as: 'hierarchy_area'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: "$hierarchy_area",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'basic_data.basic_data.company',
                foreignField: '_id',
                as: 'company'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: "$company",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'basic_data.basic_data.currency',
                foreignField: '_id',
                as: 'currency'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: "$currency",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'profit_centers',
                localField: 'basic_data.basic_data.profit_center',
                foreignField: '_id',
                as: 'profit_center'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: "$profit_center",
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            cost_center_code: data.header.cost_center_code,
            controlling_area: {
                _id: data.controlling_area._id,
                name: data.controlling_area.name,
                description: data.controlling_area.desc
            },
            valid_range: data.header.valid_range,
        },
        basic_data: {
            names: data.basic_data.names,
            basic_data: {
                // to show only some of the data if optional or nullable
                user_responsible: (data.basic_data.basic_data.user_responsible) ? {
                    _id: data.user_responsible._id,
                    full_name: `${data.user_responsible.first_name} ${data.user_responsible.last_name}`
                } : null,
                person_responsible: data.basic_data.basic_data.person_responsible,
                department: data.department,
                cost_ctr_category: (data.cost_ctr_category) ? {
                    _id: data.cost_ctr_category._id,
                    code: data.cost_ctr_category.code,
                    name: data.cost_ctr_category.name
                } : null,
                hierarchy_area: (data.hierarchy_area) ? {
                    _id: data.hierarchy_area._id,
                    code: data.hierarchy_area.code,
                    name: data.hierarchy_area.name
                } : null,
                company: {
                    _id: data.company._id,
                    code: data.company.code,
                    description: data.company.desc
                },
                business_area: data.basic_data.basic_data.business_area,
                functional_area: data.basic_data.basic_data.functional_area,
                currency: {
                    _id: data.currency._id,
                    code: data.currency.code
                },
                profit_center: (data.profit_center) ? {
                    _id: data.profit_center._id,
                    basic_data: {
                        description: {
                            name: data.profit_center.basic_data.description.name
                        },
                    },
                } : null,
            },
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};