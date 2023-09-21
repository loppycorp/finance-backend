const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/interest_calculate_arrears.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      {
        "header.vendor_account": search,
        "header.vendor_account_to": search,
        "header.company_code": search,
        "header.company_code_to": search,

        "window_1.further_selections.calculation_period": search,
        "window_1.further_selections.calculation_period_to": search,
        "window_1.further_selections.bill_of_exchange_pmnt_possible": search,
        "window_1.further_selections.bill_exh_pmnt_document_typ": search,
        "window_1.further_selections.bill_exh_pmnt_document_typ_to": search,
        "window_1.further_selections.interest_indicator": search,
        "window_1.further_selections.interest_indicator_to": search,
        "window_1.further_selections.reconcilation_account": search,
        "window_1.further_selections.reconcilation_account_to": search,
        "window_1.further_selections.sp_gl_ind_to_be_selected": search,
        "window_1.further_selections.sp_gl_ind_to_be_selected_to": search,

        "window_2.output_control.create_form": search,
        "window_2.output_control.form_name": search,
        "window_2.output_control.print_form": search,
        "window_2.output_control.form_printer_batch": search,
        "window_2.output_control.date_of_issue": search,
        "window_2.output_control.number_of_test_printouts": search,
        "window_2.output_control.additional_line_for_line_items": search,
        "window_2.output_control.display_interest_rate_changes": search,
        "window_2.output_control.print_interest_rate_table": search,
        "window_2.output_control.leap_year": search,
        "window_2.output_control.business_area_allocation": search,
        "window_2.output_control.print_account_overview": search,
        "window_2.output_control.acct_overview_printer_batch": search,
      },
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
        from: "vendor_general_datas",
        localField: "header.vendor_account",
        foreignField: "_id",
        as: "vendor",
      },
    },
    {
      $unwind: {
        path: "$vendor",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "vendor_general_datas",
        localField: "header.vendor_account_to",
        foreignField: "_id",
        as: "vendor2",
      },
    },
    {
      $unwind: {
        path: "$vendor2",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "header.company_code",
        foreignField: "_id",
        as: "company",
      },
    },
    {
      $unwind: {
        path: "$company",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "header.company_code_to",
        foreignField: "_id",
        as: "company2",
      },
    },
    {
      $unwind: {
        path: "$company2",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $match: filters },
  ];
};

exports.mapData = (data) => {
  const { company, company2, vendor, vendor2 } = data;

  return {
    _id: data._id,
    header: {
      vendor_account: vendor
        ? {
            _id: vendor._id,
            code: vendor.header.vendor_code,
            name: vendor.address.name.name,
          }
        : null,
      vendor_account_to: vendor2
        ? {
            _id: vendor2._id,
            code: vendor2.header.vendor_code,
            name: vendor2.address.name.name,
          }
        : null,
      company_code: company
        ? {
            _id: company._id,
            code: company.code,
            name: company.company_name,
            description: company.desc,
          }
        : null,
      company_code_to: company2
        ? {
            _id: company2._id,
            code: company2.code,
            name: company2.company_name,
            description: company2.desc,
          }
        : null,
    },
    window_1: data.window_1,
    window_2: data.window_2,
    status: data.status,
    date_created: data.date_created.toISOString().split("T")[0],
    date_updated: data.date_updated.toISOString().split("T")[0],
  };
};
