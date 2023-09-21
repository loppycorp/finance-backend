const ObjectId = require("mongoose").Types.ObjectId;
const defaultModel = require("../models/process_manual_bank_statement.model");
exports.search = async (searchTerm, options = {}) => {
  const filters = { status: defaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      { "header.company_code": search },
      { "header.house_bank": search },
      { "header.account_id": search },
      { "header.statement_number": search },
      { "header.statement_date": search },
      { "header.currency": search },

      { "control.control.opening_balance": search },
      { "control.control.closing_balance": search },
      { "control.control.posting_date": search },

      { "control.selection_of_payment_advices.planning_type": search },
      { "control.selection_of_payment_advices.statement_date": search },
      { "control.selection_of_payment_advices.planning_date_from": search },
      { "control.selection_of_payment_advices.planning_date_to": search },
      { "control.selection_of_payment_advices.characteristic": search },

      { "control.further_processing.bank_posting_only": search },
    ];
  }

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = defaultModel.STATUS_INACTIVE;

  const results = await defaultModel.aggregate(this.pipeline(filters));

  const mappedResults = results.map((result) => this.mapData(result));

  return { data: mappedResults, total: mappedResults.length };
};
exports.create = async (data) => {
  const defaultVariable = await defaultModel.create(data);

  if (!defaultVariable) return false;

  return await this.get(defaultVariable._id);
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

  const defaultVariable = await defaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    data
  );

  if (!defaultVariable) return false;

  return await this.get(defaultVariable._id);
};

exports.delete = async (id) => {
  const defaultVariable = await defaultModel.findByIdAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: { status: defaultModel.STATUS_INACTIVE },
    }
  );

  if (!defaultVariable) return false;

  return await this.get(defaultVariable._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
  const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

  const options = { status: defaultModel.STATUS_ACTIVE };

  const results = await defaultModel
    .find(options)
    .collation({ locale: "en" })
    .sort({ [sortBy]: sortOrderInt })
    .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
    .limit(pageLimit);

  const defaultVariableData = results.map((o) => this.mapData(o));

  const defaultVariableTotal = await defaultModel.countDocuments(options);

  return { data: defaultVariableData, total: defaultVariableTotal };
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
    {
      $unwind: {
        path: "$company_code",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "house_banks",
        localField: "header.house_bank",
        foreignField: "_id",
        as: "house_bank",
      },
    },
    {
      $unwind: {
        path: "$house_bank",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "gl_accounts",
        localField: "header.account_id",
        foreignField: "_id",
        as: "account_id",
      },
    },
    {
      $unwind: {
        path: "$account_id",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "currencies",
        localField: "header.currency",
        foreignField: "_id",
        as: "currency",
      },
    },
    {
      $unwind: {
        path: "$currency",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $match: filters },
  ];
};

exports.mapData = (data) => {
  const { company_code, house_bank, account_id, currency } = data;

  return {
    _id: data._id,
    header: {
      company_code: company_code
        ? {
            _id: company_code._id,
            name: company_code.company_name,
            description: company_code.desc,
          }
        : null,
      house_bank: house_bank
        ? {
            _id: house_bank._id,
            code: house_bank.house_bank_code,
            description: house_bank.name,
          }
        : null,
      account_id: account_id
        ? {
            _id: account_id._id,
            code: account_id.header.gl_account_code,
            description: account_id.type_description.description.short_text,
          }
        : null,
      statement_number: data.header.statement_number,
      statement_date: data.header.statement_date,
      currency: currency
        ? {
            _id: currency._id,
            code: currency.name,
            description: currency.desc,
          }
        : null,
    },
    control: data.control,
    status: data.status,
    date_created: data.date_created.toISOString().split("T")[0],
    date_updated: data.date_updated.toISOString().split("T")[0],
  };
};
