const ObjectId = require('mongoose').Types.ObjectId;
const Department = require('../models/department.model');

exports.create = async (data) => {
    const department = await Department.create(data);

    if (!department) return false;

    return await this.get(department._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Department.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Department.STATUS_INACTIVE;

    const department = await Department.findOne(filters);

    if (!department) return null;

    return this.mapData(department);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const department = await Department.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!department) return false;

    return await this.get(department._id);
};

exports.delete = async (id) => {
    const department = await Department.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Department.STATUS_INACTIVE }
    });

    if (!department) return false;

    return await this.get(department._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Department.STATUS_ACTIVE };

    const results = await Department.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const departmentsData = results.map(o => this.mapData(o));

    const departmentsTotal = await Department.countDocuments(options);

    return { data: departmentsData, total: departmentsTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        name: data.name,
        desc: data.desc,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};