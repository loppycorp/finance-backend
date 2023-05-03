const ObjectId = require("mongoose").Types.ObjectId;
const ReverseService = require("../models/reverse_document.model");

exports.create = async (data) => {
  const reverse = await ReverseService.create(data);

  if (!reverse) return false;

  return await this.get(reverse._id);
};

exports.get = async (id, options = {}) => {
  const filters = { _id: ObjectId(id), status: ReverseService.STATUS_ACTIVE };

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = ReverseService.STATUS_INACTIVE;

  const reverse = await ReverseService.findOne(filters);

  if (!reverse) return null;

  return this.mapData(reverse);
};

exports.update = async (id, data) => {
  data.date_updated = new Date();

  const reverse = await ReverseService.findByIdAndUpdate(
    { _id: ObjectId(id) },
    data
  );

  if (!reverse) return false;

  return await this.get(reverse._id);
};

exports.delete = async (id) => {
  const reverse = await ReverseService.findByIdAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: { status: ReverseService.STATUS_INACTIVE },
    }
  );

  if (!reverse) return false;

  return await this.get(reverse._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
  const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

  const filters = { status: ReverseService.STATUS_ACTIVE };

  const results = await ReverseService.aggregate(this.pipeline(filters))
    .collation({ locale: "en" })
    .sort({ [sortBy]: sortOrderInt })
    .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
    .limit(pageLimit);

  const reverseData = results.map((o) => this.mapData(o));

  const reverseTotal = await ReverseService.countDocuments(filters);

  return { data: reverseData, total: reverseTotal };
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
    document_details: data.document_details,
    specifications: data.specifications,
    check_management_spec: data.check_management_spec,
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};