const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/print_cheque.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      { "header.document_number": search },
      { "header.company_code": search },
      { "header.fiscal_year": search },

      { "items.payment_method_and_form_specifications.payment_method": search },
      {
        "items.payment_method_and_form_specifications.check_lot_number": search,
      },
      {
        "items.payment_method_and_form_specifications.alternative_form": search,
      },
      {
        "items.payment_method_and_form_specifications.padding_character":
          search,
      },

      { "items.output_control.printer_for_forms": search },
      { "items.output_control.pmnt_advice_printer": search },
      { "items.output_control.print_immediately": search },
      { "items.output_control.recipients_lang": search },
      { "items.output_control.currency_in_iso_code": search },
      { "items.output_control.test_printout": search },
      { "items.output_control.do_not_void_any_checks": search },
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
        from: "companies",
        localField: "header.company_code",
        foreignField: "_id",
        as: "company_code",
      },
    },
    { $unwind: "$company_code" },
    {
      $lookup: {
        from: "fiscal_periods",
        localField: "header.fiscal_year",
        foreignField: "_id",
        as: "fiscal_year",
      },
    },
    { $unwind: "$fiscal_year" },
    { $match: filters },
  ];
};

exports.mapData = (data) => {
  return {
    _id: data._id,
    header: {
      document_number: data.header.document_number,
      company_code: {
        _id: data.company_code._id,
        code: data.company_code.code,
        description: data.company_code.desc,
      },
      fiscal_year: {
        _id: data.fiscal_year._id,
        name: data.fiscal_year.name,
        period: data.fiscal_year.period,
      },
    },
    items: data.items,
    status: data.status,
    date_created: data.date_created.toISOString().split("T")[0],
    date_updated: data.date_updated.toISOString().split("T")[0],
  };
};
