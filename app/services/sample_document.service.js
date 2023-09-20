const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/sample_document.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, 'i');
    filters.$or = [
      { "header.document_date": search },
      { "header.posting_date": search },
      { "header.document_number": search },
      { "header.reference": search },
      { "header.doc_header_text": search },
      { "header.trading_part_ba": search },
      { "header.type": search },
      { "header.period": search },
      { "header.fiscal_year": search },
      { "header.company_code_id": search },
      { "header.currency": search },
      { "header.translatn_date": search },
      { "item.pstky": search },
      { "item.gl_account_id": search },
      { "item.sgl_ind": search },
      { "item.ttype": search }

    ];
  }

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = DefaultModel.STATUS_INACTIVE;

  const results = await DefaultModel.aggregate(this.pipeline(filters));

  const mappedResults = results.map(result => this.mapData(result));

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
    // {
    //     $lookup: {
    //         from: 'vendors',
    //         localField: 'vendor_id',
    //         foreignField: '_id',
    //         as: 'vendor_id'
    //     },
    // },
    // { $unwind: '$vendor_id' },
    { $match: filters },
  ];
};

exports.mapData = (data) => {
  return {
    _id: data._id,
    header: data.header,
    item: data.item,
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};
