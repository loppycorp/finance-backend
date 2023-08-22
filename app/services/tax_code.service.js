const ObjectId = require('mongoose').Types.ObjectId;
const defaultModel = require('../models/tax_code.model');

exports.create = async (data) => {
    const defaultVariable = await defaultModel.create(data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: defaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = defaultModel.STATUS_INACTIVE;

    const defaultVariable = await defaultModel.findOne(filters);

    if (!defaultVariable) return null;

    return this.mapData(defaultVariable);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const defaultVariable = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id);
};

exports.delete = async (id) => {
    const defaultVariable = await defaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: defaultModel.STATUS_INACTIVE }
    });

    if (!defaultVariable) return false;

    return await this.get(defaultVariable._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: defaultModel.STATUS_ACTIVE };

    const results = await defaultModel.find(options)
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const defaultVariableData = results.map(o => this.mapData(o));

    const defaultVariableTotal = await defaultModel.countDocuments(options);

    return { data: defaultVariableData, total: defaultVariableTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        tax_code: data.tax_code,
        description: data.description,
        jmx1: data.jmx1,
        jmop: data.jmop,
        jex1: data.jex1,
        jec1: data.jec1,
        jhx1: data.jhx1,
        jse1: data.jse1,
        jvrd: data.jvrd,
        smx1: data.smx1,
        jsrt: data.jsrt,
        jec3: data.jec3,
        jse3: data.jse3,
        jmx2: data.jmx2,
        jmi2: data.jmi2,
        jmip: data.jmip,
        jex2: data.jex2,
        jec2: data.jec2,
        jhx2: data.jhx2,
        jse2: data.jse2,
        jvrn: data.jvrn,
        jipc: data.jipc,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};