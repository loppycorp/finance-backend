const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/maintain_tax_code.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      { "header.country_key": search },
      { "header.tax_code": search },
      { "header.procedure": search },
      { "header.tax_type": search },
      { "percentage_rates.item.tax_type": search },
      { "percentage_rates.item.acct_key": search },
      { "percentage_rates.item.tax_percent_rate": search },
      { "percentage_rates.item.level": search },
      { "percentage_rates.item.from_lvl": search },
      { "percentage_rates.item.cont_type": search },
    ];
  }

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = DefaultModel.STATUS_INACTIVE;

  const results = await DefaultModel.aggregate(this.pipeline(filters));

  const mappedResults = results.map((result) => this.mapData(result));

  return { data: mappedResults, total: mappedResults.length };
};
exports.create = async (data) => {
  const defaultVariable = await DefaultModel.create(data);

  if (!defaultVariable) return false;

  return await this.get(defaultVariable._id);
};

exports.get = async (id, options = {}) => {
  const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = DefaultModel.STATUS_INACTIVE;

  const results = await DefaultModel.aggregate(this.pipeline(filters));
  const defaultVariable = results[0];

  if (!defaultVariable) return null;

  return this.mapData(defaultVariable);
};

exports.update = async (id, data) => {
  data.date_updated = new Date();

  const defaultVariable = await DefaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    data
  );

  if (!defaultVariable) return false;

  return await this.get(defaultVariable._id);
};

exports.delete = async (id) => {
  const defaultVariable = await DefaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: { status: DefaultModel.STATUS_INACTIVE },
    }
  );

  if (!defaultVariable) return false;

  return await this.get(defaultVariable._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
  const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

  const filters = { status: DefaultModel.STATUS_ACTIVE };

  const results = await DefaultModel.aggregate(this.pipeline(filters))
    .collation({ locale: "en" })
    .sort({ [sortBy]: sortOrderInt })
    .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
    .limit(pageLimit);

  const bankKeyData = results.map((o) => this.mapData(o));

  const bankKeyTotal = await DefaultModel.countDocuments(filters);

  return { data: bankKeyData, total: bankKeyTotal };
};

exports.getByCode = async (document_number, existing_id) => {
  const options = {
    document_number: document_number,
    status: DefaultModel.STATUS_ACTIVE,
  };

  if (existing_id && existing_id != "") options["_id"] = { $ne: existing_id };

  return (await DefaultModel.countDocuments(options)) > 0;
};

exports.pipeline = (filters) => {
  return [
    {
      $lookup: {
        from: "countries",
        localField: "header.country_key",
        foreignField: "_id",
        as: "country_key",
      },
    },
    {
      $unwind: {
        path: "$country_key",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "tax_codes",
        localField: "header.tax_code",
        foreignField: "_id",
        as: "tax_code",
      },
    },
    {
      $unwind: {
        path: "$tax_code",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "procedures",
        localField: "header.procedure",
        foreignField: "_id",
        as: "procedure",
      },
    },
    {
      $unwind: {
        path: "$procedure",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "tax_types",
        localField: "header.tax_type",
        foreignField: "_id",
        as: "tax_type",
      },
    },
    {
      $unwind: {
        path: "$tax_type",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: filters },
  ];
};

exports.mapData = (data) => {
  const { country_key, tax_code, procedure, tax_type } = data;

  return {
    _id: data._id,
    header: {
      country_key: country_key
        ? {
            _id: country_key._id,
            name: country_key.name,
            description: country_key.desc,
          }
        : null,
      tax_code: tax_code
        ? {
            _id: tax_code._id,
            tax_code: tax_code.tax_code,
          }
        : null,
      procedure: procedure
        ? {
            _id: procedure._id,
            name: procedure.name,
            description: procedure.desc,
          }
        : null,
      tax_type: tax_type
        ? {
            _id: tax_type._id,
            name: tax_type.name,
            description: tax_type.desc,
          }
        : null,
    },
    percentage_rates: data.percentage_rates,
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};
