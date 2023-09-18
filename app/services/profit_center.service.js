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

    console.log(profitCenter)

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

// added search 
exports.search = async (searchTerm, options = {}) => {
    const filters = { status: ProfitCenter.STATUS_ACTIVE };

    if (searchTerm) {
        const search = new RegExp(searchTerm, 'i');
        filters.$or = [
            { "_id": search },
            { "header.controlling_area._id": search },
            { "header.controlling_area.name": search },
            { "header.controlling_area.description": search },
            { "basic_data.description.profit_center_code": search },
            { "basic_data.description.analysis_period.from": search },
            { "basic_data.description.analysis_period.to": search },
            { "basic_data.description.name": search },
            { "basic_data.description.long_text": search },
            { "basic_data.description.status": search },
            { "basic_data.basic_data.user_responsible._id": search },
            { "basic_data.basic_data.user_responsible.full_name": search },
            { "basic_data.basic_data.person_responsible": search },
            { "basic_data.basic_data.department._id": search },
            { "basic_data.basic_data.department.name": search },
            { "basic_data.basic_data.department.description": search },
            { "basic_data.basic_data.profit_ctr_group._id": search },
            { "basic_data.basic_data.profit_ctr_group.group_name": search },
            { "basic_data.basic_data.profit_ctr_group.group_code": search },
            { "basic_data.basic_data.profit_ctr_group.desc": search },
            { "basic_data.basic_data.profit_ctr_group.status": search },
            { "basic_data.basic_data.profit_ctr_group.date_created": search },
            { "basic_data.basic_data.profit_ctr_group.date_updated": search },
            { "basic_data.basic_data.segment._id": search },
            { "basic_data.basic_data.segment.name": search },
            { "basic_data.basic_data.segment.desc": search },
            { "basic_data.basic_data.segment.status": search },
            { "basic_data.basic_data.segment.date_created": search },
            { "basic_data.basic_data.segment.date_updated": search }
        ];
    }

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = ProfitCenter.STATUS_INACTIVE;

    const results = await ProfitCenter.aggregate(this.pipeline(filters));

    const mappedResults = results.map(result => this.mapData(result));

    return { data: mappedResults, total: mappedResults.length };
};

exports.getByCode = async (code, existing_id) => {
    const options = { 'basic_data.description.profit_center_code': code, status: ProfitCenter.STATUS_ACTIVE };

    if (existing_id && existing_id != '')
        options['_id'] = { $ne: existing_id };

    return await ProfitCenter.countDocuments(options) > 0;

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
                from: 'profit_center_groups',
                localField: 'basic_data.basic_data.profit_ctr_group',
                foreignField: '_id',
                as: 'profit_ctr_group'
            },
        },
        {
            $unwind: {
                path: "$profit_ctr_group",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'segments',
                localField: 'basic_data.basic_data.segment',
                foreignField: '_id',
                as: 'segment'
            },
        },
        {
            $unwind: {
                path: "$segment",
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
            controlling_area: {
                _id: data.controlling_area._id,
                name: data.controlling_area.name,
                description: data.controlling_area.desc
            },
        },
        basic_data: {
            description: data.basic_data.description,
            basic_data: {
                // to show only some of the data if optional or nullable
                user_responsible: (data.basic_data.basic_data.user_responsible)
                    ? {
                        _id: data.user_responsible._id,
                        full_name: `${data.user_responsible.first_name} ${data.user_responsible.last_name}`
                    } : null,
                person_responsible: data.basic_data.basic_data.person_responsible,

                department: (data.basic_data.basic_data.department)
                    ? {
                        _id: data.department._id,
                        name: data.department.name,
                        description: data.department.desc
                    } : null,
                profit_ctr_group: (data.profit_ctr_group) ? data.profit_ctr_group : null,
                segment: (data.segment) ? data.segment : null,
            },
        },
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0],
        created_by: data.created_by,
        updated_by: data.updated_by
    };
};