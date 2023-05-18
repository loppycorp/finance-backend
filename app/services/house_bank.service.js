const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/house_bank.model");

exports.create = async (data) => {
  const dftModel = await DefaultModel.create(data);

  if (!dftModel) return false;

  return await this.get(dftModel._id);
};
exports.get = async (id, options = {}) => {
  const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = DefaultModel.STATUS_INACTIVE;

  const results = await DefaultModel.aggregate(this.pipeline(filters));
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
  const options = {
    "header.house_bank_code": code,
    status: DefaultModel.STATUS_ACTIVE,
  };

  if (existing_id && existing_id != "") options["_id"] = { $ne: existing_id };

  return (await DefaultModel.countDocuments(options)) > 0;
};

exports.pipeline = (filters) => {
  return [
    {
      $lookup: {
        from: "companies",
        localField: "header.company_code",
        foreignField: "_id",
        as: "company_code",
      },
    },

    { $unwind: "$company_code" },
    {
      $lookup: {
        from: "countries",
        localField: "header.bank_country",
        foreignField: "_id",
        as: "bank_country",
      },
    },
    {
      $unwind: {
        path: '$bank_country',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "bank_groups",
        localField: "control_data.bank_group",
        foreignField: "_id",
        as: "bank_group",
      },
    },

    { $match: filters },
  ];
};

exports.mapData = (data) => {
  return {
    _id: data._id,
    header: {
      company_code: {
        _id: data.company_code._id,
        code: data.company_code.code,
        description: data.company_code.desc,
      },
      house_bank_code: data.header.house_bank_code,
      bank_country: {
        bank_country: data.header.bank_country
          ? {
            _id: data.bank_country._id,
            name: data.bank_country.name,
          }
          : null,
      },
      bank_key_code: data.header.bank_key_code,
    },
    address: {
      name: data.address.name,
      region: data.address.region,
      street: data.address.street,
      city: data.address.city,
      bank_branch: data.address.bank_branch,
    },
    control_data: {
      swift_code: data.control_data.swift_code,
      bank_group: {
        bank_group: data.control_data.bank_group
          ? {
            _id: data.bank_group._id,
            name: data.bank_group.name,
          }
          : null,
      },
      postbank_account: data.control_data.postbank_account,
      bank_number: data.control_data.bank_number,
    },
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};
