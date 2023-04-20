const ObjectId = require('mongoose').Types.ObjectId;
const Scndry_cst_elmt = require('../models/secondary_cost_element.model');


exports.create = async (data) => {
    const scndry_cst_elmt = await Scndry_cst_elmt.create(data);

    if (!scndry_cst_elmt) return false;

    return await this.get(scndry_cst_elmt._id)
};
exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Scndry_cst_elmt.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Scndry_cst_elmt.STATUS_INACTIVE;

    const scndry_cst_elmt = await Scndry_cst_elmt.findOne(filters);

    if (!scndry_cst_elmt) return null;

    return this.mapData(scndry_cst_elmt);
};
exports.update = async (id, data) => {
    data.date_updated = new Date();

    const scndry_cst_elmt = await Scndry_cst_elmt.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!scndry_cst_elmt) return false;

    return await this.get(scndry_cst_elmt._id);
};
exports.delete = async (id) => {
    const scndry_cst_elmt = await Scndry_cst_elmt.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Scndry_cst_elmt.STATUS_INACTIVE }
    });

    if (!scndry_cst_elmt) return false;

    return await this.get(scndry_cst_elmt._id, { allowed_inactive: true });
};
exports.mapData = (data) => {
    return {
        _id: data._id,
        cost_element: data.cost_element,
        controlling_area_id: data.controlling_area_id,
        valid_from: data.valid_from,
        valid_to: data.valid_to,
        name: data.name,
        description: data.description,
        cost_elem_ctgry: data.cost_elem_ctgry,
        attribute: data.attribute,
        func_area: data.func_area,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};
exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Scndry_cst_elmt.STATUS_ACTIVE };

    const results = await Scndry_cst_elmt.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const scdryCstElmtData = results.map(o => this.mapData(o));

    const scdryCstElmtTotal = await Scndry_cst_elmt.countDocuments(options);

    return { data: scdryCstElmtData, total: scdryCstElmtTotal };
};

