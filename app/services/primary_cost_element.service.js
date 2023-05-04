const ObjectId = require('mongoose').Types.ObjectId;
const Prmry_cst_elmt = require('../models/primary_cost_element.model');


exports.create = async (data) => {
    const prmry_cst_elmt = await Prmry_cst_elmt.create(data);

    if (!prmry_cst_elmt) return false;

    return await this.get(prmry_cst_elmt._id)
};
exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Prmry_cst_elmt.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Prmry_cst_elmt.STATUS_INACTIVE;

    const prmry_cst_elmt = await Prmry_cst_elmt.findOne(filters);

    if (!prmry_cst_elmt) return null;

    return this.mapData(prmry_cst_elmt);
};
exports.update = async (id, data) => {
    data.date_updated = new Date();

    const prmry_cst_elmt = await Prmry_cst_elmt.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!prmry_cst_elmt) return false;

    return await this.get(prmry_cst_elmt._id);
};
exports.delete = async (id) => {
    const prmry_cst_elmt = await Prmry_cst_elmt.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Prmry_cst_elmt.STATUS_INACTIVE }
    });

    if (!prmry_cst_elmt) return false;

    return await this.get(prmry_cst_elmt._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Prmry_cst_elmt.STATUS_ACTIVE };

    const results = await Prmry_cst_elmt.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const prmryCstElmtData = results.map(o => this.mapData(o));

    const prmryCstElmtTotal = await Prmry_cst_elmt.countDocuments(options);

    return { data: prmryCstElmtData, total: prmryCstElmtTotal };
};

exports.getByCode = async (cost_element, existing_id) => {
    const options = { cost_element: cost_element, status: Prmry_cst_elmt.STATUS_ACTIVE };

    if (existing_id && existing_id != '')
        options['_id'] = { $ne: existing_id };

    return await Prmry_cst_elmt.countDocuments(options) > 0;

};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'controlling_areas',
                localField: 'controlling_area_id',
                foreignField: '_id',
                as: 'controlling_area_id'
            },
        },
        { $unwind: '$controlling_area_id' },
        {
            $lookup: {
                from: 'cost_elem_categries',
                localField: 'basic_data.cost_elem_ctgry',
                foreignField: '_id',
                as: 'cost_elem_ctgry'
            },
        },
        { $unwind: '$cost_elem_ctgry' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        cost_element: data.cost_element,
        controlling_area_id: data.controlling_area_id,
        valid_from: data.valid_from,
        valid_to: data.valid_to,
        names: data.names,
        basic_data: data.basic_data,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};
