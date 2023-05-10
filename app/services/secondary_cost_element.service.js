const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/secondary_cost_element.model");

exports.create = async (data) => {
  const dftModel = await DefaultModel.create(data);

  if (!dftModel) return false;

  return await this.get(dftModel._id);
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

  const dftModel = await DefaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    data
  );

  if (!dftModel) return false;

  return await this.get(dftModel._id);
};
exports.delete = async (id) => {
  const dftModel = await DefaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: { status: DefaultModel.STATUS_INACTIVE },
    }
  );

  if (!dftModel) return false;

  return await this.get(dftModel._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
  const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

  const options = { status: DefaultModel.STATUS_ACTIVE };

  const results = await DefaultModel.aggregate(this.pipeline(options))
    .collation({ locale: "en" })
    .sort({ [sortBy]: sortOrderInt })
    .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
    .limit(pageLimit);

  const dftModelData = results.map((o) => this.mapData(o));

  const dftModelTotal = await DefaultModel.countDocuments(options);

  return { data: dftModelData, total: dftModelTotal };
};

exports.getByCode = async (code, existing_id) => {
  const options = { "header.cost_element_code": code, status: DefaultModel.STATUS_ACTIVE, };

  if (existing_id && existing_id != "")
    options["_id"] = { $ne: existing_id };

  return (await DefaultModel.countDocuments(options)) > 0;
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
        from: 'cost_element_categories',
        localField: 'basic_data.basic_data.cost_element_category',
        foreignField: '_id',
        as: 'cost_element_category',
      },
    },
    // if the id is optional or nullable
    { $unwind: '$cost_element_category', },

    { $match: filters },
  ];
};
exports.mapData = (data) => {
  return {
    _id: data._id,
    header: {
      cost_element_code: data.header.cost_element_code,
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
        cost_element_category: {
          _id: data.cost_element_category._id,
          code: data.cost_element_category.code,
          name: data.cost_element_category.name
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
