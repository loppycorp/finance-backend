const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/goods.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      { "header.document_number": search },
      { "header.document_date": search },
      { "header.reference": search },
      { "header.currency": search },
      { "header.company_code": search },
      { "header.posting_date": search },
      { "header.cross_cc_no": search },
      { "header.fiscal_year": search },
      { "header.period": search },
      { "header.ledger_group": search },

      { "item.item.company_code": search },
      { "item.item.posting_key": search },
      { "item.item.s": search },
      { "item.item.account": search },
      { "item.item.description": search },
      { "item.item.amount": search },
      { "item.item.currency": search },
      { "item.item.tax": search },
      { "item.item.cost_center": search },
      { "item.item.profit_center": search },
      { "item.item.segment": search },
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
        from: "fiscal_period ",
        localField: "header.fiscal_year",
        foreignField: "_id",
        as: "fiscal_year",
      },
    },
    {
      $unwind: {
        path: "$fiscal_year",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "fiscal_period ",
        localField: "header.period ",
        foreignField: "_id",
        as: "period",
      },
    },
    {
      $unwind: {
        path: "$period",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "ledger_groups ",
        localField: "header.ledger_group",
        foreignField: "_id",
        as: "ledger_group",
      },
    },
    {
      $unwind: {
        path: "$ledger_group",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "companies",
        localField: "item.item.company_code",
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
        from: "posting_keys ",
        localField: "item.item.posting_key",
        foreignField: "_id",
        as: "posting_key",
      },
    },
    {
      $unwind: {
        path: "$posting_key",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "gl_accounts",
        localField: "item.item.account",
        foreignField: "_id",
        as: "account",
      },
    },
    {
      $unwind: {
        path: "$account",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "currencies ",
        localField: "item.item.currency",
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
    {
      $lookup: {
        from: "cost_centers ",
        localField: "item.item.cost_center",
        foreignField: "_id",
        as: "cost_center",
      },
    },
    {
      $unwind: {
        path: "$cost_center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "profit_centers ",
        localField: "item.item.profit_center",
        foreignField: "_id",
        as: "profit_center",
      },
    },
    {
      $unwind: {
        path: "$profit_center",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "segments ",
        localField: "item.item.segment",
        foreignField: "_id",
        as: "segment",
      },
    },
    {
      $unwind: {
        path: "$segment",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $match: filters },
  ];
};

exports.mapData = (data) => {
  const {
    company_code,
    currency,
    fiscal_year,
    ledger_group,
    posting_key,
    account,
    cost_center,
    profit_center,
    segment,
  } = data;

  const itemsArray = Array.isArray(data.item.item) ? data.item.item : [];
  const companies = Array.isArray(data.companies) ? data.companies : [];
  const posting_keys = Array.isArray(data.posting_keys)
    ? data.posting_keys
    : [];
  const gl_accounts = Array.isArray(data.gl_accounts) ? data.gl_accounts : [];
  const currencies = Array.isArray(data.currencies) ? data.currencies : [];
  const cost_centers = Array.isArray(data.cost_centers)
    ? data.cost_centers
    : [];
  const profit_centers = Array.isArray(data.profit_centers)
    ? data.profit_centers
    : [];
  const segments = Array.isArray(data.segments) ? data.segments : [];

  return {
    _id: data._id,
    header: {
      document_number: data.header.document_number,
      document_date: data.header.document_date,
      reference: data.header.reference,
      currency: currency
        ? {
            _id: currency._id,
            code: currency.code,
            name: currency.name,
            description: currency.desc,
          }
        : null,
      company_code: company_code
        ? {
            _id: company_code._id,
            name: company_code.company_name,
            description: company_code.desc,
          }
        : null,
      posting_date: data.header.posting_date,
      cross_cc_no: data.header.cross_cc_no,
      fiscal_year: fiscal_year
        ? {
            _id: fiscal_year._id,
            period: fiscal_year.period,
            name: fiscal_year.name,
          }
        : null,
      period: fiscal_year
        ? {
            _id: fiscal_year._id,
            period: fiscal_year.period,
          }
        : null,
      ledger_group: ledger_group
        ? {
            _id: ledger_group._id,
            code: ledger_group.code,
            name: ledger_group.company_name,
            description: ledger_group.desc,
          }
        : null,
    },
    items: itemsArray.map((o) => {
      const itemCompany = companies.find(
        (i) => i._id.toString() == o.company.toString()
      );
      const itemPk = posting_keys.find(
        (i) => i._id.toString() == o.pk.toString()
      );
      const itemGLAcct = gl_accounts.find(
        (i) => i._id.toString() == o.account.toString()
      );
      const itemCurrency = currencies.find(
        (i) => i._id.toString() == o.currency.toString()
      );
      const itemCostCenter = cost_centers.find(
        (i) => i._id.toString() == o.cost_center.toString()
      );
      const itemProfitCenter = profit_centers.find(
        (i) => i._id.toString() == o.profit_center.toString()
      );
      const itemSegment = segments.find(
        (i) => i._id.toString() == o.segment.toString()
      );

      return {
        company_code: itemCompany
          ? {
              _id: itemCompany._id,
              code: itemCompany.code,
              company_name: itemCompany.company_name,
              desc: itemCompany.desc,
            }
          : null,
        posting_key: itemPk
          ? {
              _id: itemPk._id,
              posting_key_code: itemPk.posting_key_code,
              name: itemPk.name,
              type: itemPk.type,
            }
          : null,
        s: o.s,
        account: itemGLAcct
          ? {
              _id: itemGLAcct._id,
              header: itemGLAcct.header,
              type_description: {
                description: {
                  short_text:
                    itemGLAcct.type_description.description.short_text,
                },
              },
            }
          : null,
        description: o.description,
        amount: o.amount,
        currency: itemCurrency
          ? {
              _id: itemCurrency._id,
              code: itemCurrency.code,
              name: itemCurrency.name,
            }
          : null,
        tax: o.tax,
        cost_center: itemCostCenter
          ? {
              _id: itemCostCenter._id,
              code: itemCostCenter.header.cost_center_code,
            }
          : null,
        profit_center: itemProfitCenter
          ? {
              _id: itemProfitCenter._id,
              profit_center_name: itemProfitCenter.group_name,
              profit_center_code: itemProfitCenter.group_code,
            }
          : null,
        segment: itemSegment
          ? {
              _id: itemSegment._id,
              code: itemSegment.code,
              name: itemSegment.name,
            }
          : null,
      };
    }),
    status: data.status,
    date_created: data.date_created.toISOString().split("T")[0],
    date_updated: data.date_updated.toISOString().split("T")[0],
  };
};
