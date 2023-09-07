const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/view_cost_of_final_product.model");

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
        {
            $lookup: {
                from: 'plants',
                localField: 'header.plant',
                foreignField: '_id',
                as: 'plant'
            },
        },

        {
            $unwind: {
                path: '$plant',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'costs.component_view.currency',
                foreignField: '_id',
                as: 'currency'
            },
        },
        {
            $unwind: {
                path: '$currency',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'cost_element_categories',
                localField: 'costs.items.cost_element',
                foreignField: '_id',
                as: 'cost_element'
            },
        },
        {
            $unwind: {
                path: '$cost_element',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'currencies',
                localField: 'costs.items.currency',
                foreignField: '_id',
                as: 'currency'
            },
        },
        {
            $unwind: {
                path: '$currency',
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters }
    ];
}; exports.mapData = (data) => {
    const { material, plant, currency, currency1, element } = data;

    return {
        _id: data._id,
        header: {
            material: (material) ? {
                _id: material._id,
                code: material.code,
                description: plant.desc,
            } : null,
            plant: (plant) ? {
                _id: plant._id,
                code: plant.code,
                description: plant.desc,
            } : null,
        },
        window: {
            costing_data: {
                costing_variant: data.window.costing.costing_variant,
                costing_version: data.window.costing.costing_version,
                costing_lot_size: data.window.costing.costing_lot_size,
                transfer_control: data.window.costing.transfer_control,
            },
            costs: {
                costs_based_on: data.window.costs.costs_based_on,
                component_view: {
                    cost_component_view: data.window.costs.component_view.cost_component_view,
                    total_costs: data.window.costs.component_view.total_costs,
                    fixed_costs: data.window.costs.component_view.fixed_costs,
                    variable: data.window.costs.component_view.variable,
                    currency: (currency) ? {
                        _id: currency._id,
                        code: currency.code,
                        name: currency.name,
                        description: currency.desc,
                    } : null,
                },
                items: {
                    i: data.window.costs.items.i,
                    resource: data.window.costs.items.resource,
                    cost_element: (element) ? {
                        _id: element._id,
                        code: element.code,
                        name: element.name,
                    } : null,
                    total_value: data.window.costs.items.total_value,
                    fixed_value: data.window.costs.items.fixed_value,
                    currency: (currency1) ? {
                        _id: currency1._id,
                        code: currency1.code,
                        name: currency1.name,
                        description: currency1.desc,
                    } : null,
                }
            }
        },
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0],
    };
};
