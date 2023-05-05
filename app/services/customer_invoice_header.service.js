const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/customer_invoice_header.model");

exports.create = async (data) => {
  const defaultModel = await DefaultModel.create(data);

  if (!defaultModel) return false;

  return await this.get(defaultModel._id);
};

exports.get = async (id, options = {}) => {
  const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = DefaultModel.STATUS_INACTIVE;

  const defaultModel = await DefaultModel.findOne(filters);

  if (!defaultModel) return null;

  return this.mapData(defaultModel);
};

exports.update = async (id, data) => {
  data.date_updated = new Date();

  const defaultModel = await DefaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    data
  );

  if (!defaultModel) return false;

  return await this.get(defaultModel._id);
};

exports.delete = async (id) => {
  const defaultModel = await DefaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: { status: DefaultModel.STATUS_INACTIVE },
    }
  );

  if (!defaultModel) return false;

  return await this.get(defaultModel._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
  const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

  const filters = { status: DefaultModel.STATUS_ACTIVE };

  const results = await DefaultModel.aggregate(this.pipeline(filters))
    .collation({ locale: "en" })
    .sort({ [sortBy]: sortOrderInt })
    .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
    .limit(pageLimit);

  const assetData = results.map((o) => this.mapData(o));

  const assetTotal = await DefaultModel.countDocuments(filters);

  return { data: assetData, total: assetTotal };
};

exports.pipeline = (filters) => {
  return [
    // {
    //     $lookup: {
    //         from: 'companies',
    //         localField: 'company_code_id',
    //         foreignField: '_id',
    //         as: 'company'
    //     },
    // },
    // { $unwind: '$company' },
    // {
    //     $lookup: {
    //         from: 'cost_centers',
    //         localField: 'time_dependent.interval.cost_center_id',
    //         foreignField: '_id',
    //         as: 'cost_center'
    //     },
    // },
    // { $unwind: '$cost_center' },
    // { $match: filters }
  ];
};

exports.mapData = (data) => {
  return {
    _id: data._id,
    header_data: data.header_data,
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};
