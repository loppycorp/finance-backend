const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/accrual_deferral_document.model");

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

exports.getByCode = async (house_bank_code, existing_id) => {
  const options = {
    house_bank_code: house_bank_code,
    status: DefaultModel.STATUS_ACTIVE,
  };

  if (existing_id && existing_id != "") options["_id"] = { $ne: existing_id };

  return (await DefaultModel.countDocuments(options)) > 0;
};

exports.pipeline = (filters) => {
  return [
    {
      $lookup: {
        from: 'ledger_groups',
        localField: 'header.ledger_group',
        foreignField: '_id',
        as: 'ledger_group'
      },
    },
    {
      $unwind: {
        path: "$ledger_group",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'companies',
        localField: 'header.company_code',
        foreignField: '_id',
        as: 'company_code'
      },
    },
    {
      $unwind: {
        path: "$company_code",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'posting_keys',
        localField: 'item.pstky',
        foreignField: '_id',
        as: 'pstky'
      },
    },
    {
      $unwind: {
        path: "$pstky",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'gl_accounts',
        localField: 'item.account',
        foreignField: '_id',
        as: 'account'
      },
    },
    {
      $unwind: {
        path: "$account",
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $lookup: {
        from: 'ledger_groups',
        localField: 'data_entry_view.ledger_group',
        foreignField: '_id',
        as: 'ledger_group'
      },
    },
    {
      $unwind: {
        path: "$ledger_group",
        preserveNullAndEmptyArrays: true
      }
    },
    { $match: filters },
  ];
};

exports.mapData = (data) => {
  return {
    _id: data._id,
    header: {
      document_date: data.header.document_date,
      posting_date: data.header.posting_date,
      document_number: data.header.document_number,
      reference: data.header.reference,
      doc_header_text: data.header.doc_header_text,
      trading_part_ba: data.header.trading_part_ba,
      type: data.header.type,
      period: data.header.period,
      ledger_group: (data.header.ledger_group) ? {
        _id: data.ledger_group._id,
      } : null,
      company_code: {
        _id: data.company_code._id,
      },
      currency_rate: data.header.currency_rate,
      translatn_date: data.header.translatn_date,
      cross_cc_no: data.header.cross_cc_no,
    },
    inverse_posting: data.inverse_posting,
    item: {
      pstky: {
        _id: data.pstky._id,
      },
      account: {
        _id: data.account._id,
      },
      sgl_ind: data.item.sgl_ind,
      ttype: data.item.ttype,

    },
    data_entry_view: {
      document_number: data.data_entry_view.document_number,
      document_date: data.data_entry_view.document_date,
      reference: data.data_entry_view.reference,
      currency: data.data_entry_view.currency,
      posting_date: data.data_entry_view.posting_date,
      cross_cc_no: data.data_entry_view.cross_cc_no,
      fiscal_year: data.data_entry_view.fiscal_year,
      period: data.data_entry_view.period,
      ledger_group: (data.data_entry_view.ledger_group) ? {
        _id: data.ledger_group._id,
      } : null,
      texts_exist: data.data_entry_view.texts_exist,
    },
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};
