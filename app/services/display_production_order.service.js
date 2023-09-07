const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/display_production_order.model");

exports.create = async (data) => {
    const defaultVariable = await DefaultModel.create(data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = DefaultModel.STATUS_INACTIVE;

    const results = await DefaultModel.aggregate(this.pipeline(filters));
    const defaultVariable = results[0];

    if (!defaultVariable) return null;

    return this.mapData(defaultVariable);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const defaultVariable = await DefaultModel.findByIdAndUpdate(
        { _id: ObjectId(id) },
        data
    );

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};

exports.delete = async (id) => {
    const defaultVariable = await DefaultModel.findByIdAndUpdate(
        { _id: ObjectId(id) },
        {
            $set: { status: DefaultModel.STATUS_INACTIVE },
        }
    );

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(filters))
        .collation({ locale: "en" })
        .sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
        .limit(pageLimit);

    const bankKeyData = results.map((o) => this.mapData(o));

    const bankKeyTotal = await DefaultModel.countDocuments(filters);

    return { data: bankKeyData, total: bankKeyTotal };
};

exports.getByCode = async (document_number, existing_id) => {
    const options = {
        document_number: document_number,
        status: DefaultModel.STATUS_ACTIVE,
    };

    if (existing_id && existing_id != "") options["_id"] = { $ne: existing_id };

    return (await DefaultModel.countDocuments(options)) > 0;
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'order_types',
                localField: 'header.order',
                foreignField: '_id',
                as: 'order'
            },
        },
        {
            $unwind: {
                path: '$order',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'material_types',
                localField: 'header.material',
                foreignField: '_id',
                as: 'material'
            },
        },
        {
            $unwind: {
                path: '$material',
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters }
    ];
}; exports.mapData = (data) => {
    const { material, order } = data;

    return {
        _id: data._id,
        header: {
            order: (order) ? {
                _id: order._id,
                type: order.order_type.type,
                code: order.order_type.code,
                name: order.order_type.name,
            } : null,
            material: (material) ? {
                _id: material._id,
                code: material.code,
                description: material.desc,
            } : null,
            status: data.header.status,
        },
        general: data.general,
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0],
    };
};
