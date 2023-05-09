const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/primary_cost_element.model");

exports.create = async (data) => {
  const defaultModel = await DefaultModel.create(data);

  if (!defaultModel) return false;

  return await this.get(defaultModel._id);
};
exports.get = async (id, options = {}) => {
  const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = DefaultModel.STATUS_INACTIVE;

  const results = await DefaultModel.aggregate(this.pipeline(filters))
  const defaultModel = results[0];

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

  const options = { status: DefaultModel.STATUS_ACTIVE };

  const results = await DefaultModel.aggregate(this.pipeline(options))
    .collation({ locale: "en" })
    .sort({ [sortBy]: sortOrderInt })
    .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
    .limit(pageLimit);

  const defaultModelData = results.map((o) => this.mapData(o));

  const defaultModelTotal = await DefaultModel.countDocuments(options);

  return { data: defaultModelData, total: defaultModelTotal };
};

exports.pipeline = (filters) => {
  return [
    {
      $lookup: {
        from: 'controlling_areas',
        localField: 'header.controlling_area_code',
        foreignField: '_id',
        as: 'controlling_area_code',
      },
    },
    // if the id is required
    { $unwind: '$controlling_area_code', },
    {
      $lookup: {
        from: 'cost_elem_categries',
        localField: 'basic_data.basic_data.cost_elem_ctgry',
        foreignField: '_id',
        as: 'cost_elem_ctgry',
      },
    },
    // if the id is optional or nullable
    { $unwind: '$cost_elem_ctgry', },

    { $match: filters },
  ];
};

exports.mapData = (data) => {
  return {
    _id: data._id,
    header: {
      cost_element_code: data.cost_element_code,
      controlling_area_code: {
        _id: data.controlling_area_code._id,
        code: data.controlling_area_code.code,
        description: data.controlling_area_code.desc,
      },
      valid_from: data.header.valid_from,
      valid_to: data.header.valid_to,
    },
    basic_data: {
      names: {
        name: data.basic_data.names.name,
        description: data.basic_data.names.description,
      },
      basic_data: {
        cost_elem_ctgry: {
          _id: data.cost_elem_ctgry._id,
          code: data.cost_elem_ctgry.code,
          name: data.cost_elem_ctgry.name
        },
        attribute: data.basic_data.basic_data.attribute,
        func_area: data.basic_data.basic_data.func_area,
      },
    },
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};
