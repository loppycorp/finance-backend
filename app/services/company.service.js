const ObjectId = require('mongoose').Types.ObjectId;
const Company = require('../models/company.model');

exports.create = async (data) => {
    const company = await Company.create(data);

    if (!company) return false;

    return await this.get(company._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Company.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Company.STATUS_INACTIVE;

    const company = await Company.findOne(filters);

    if (!company) return null;

    return this.mapData(company);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const company = await Company.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!company) return false;

    return await this.get(company._id);
};

exports.delete = async (id) => {
    const company = await Company.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Company.STATUS_INACTIVE }
    });

    if (!company) return false;

    return await this.get(company._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Company.STATUS_ACTIVE };

    const results = await Company.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const companiesData = results.map(o => this.mapData(o));

    const companiesTotal = await Company.countDocuments(options);

    return { data: companiesData, total: companiesTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        company_name: data.company_name,
        desc: data.desc,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};