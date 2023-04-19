const Prmry_cst_elmt = require('../models/primary_cost_element.model');

exports.create = async (data) => {
    const prmry_cst_elmt = await Prmry_cst_elmt.create(data);

    if (!prmry_cst_elmt) return false;

    return await this.get(prmry_cst_elmt._id)
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

