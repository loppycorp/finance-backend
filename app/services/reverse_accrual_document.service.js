const ObjectId = require("mongoose").Types.ObjectId;
const ReverseService = require("../models/reverse_accrual_document.model");

exports.create = async (data) => {
  const reverse = await ReverseService.create(data);

  if (!reverse) return false;

  return await this.get(reverse._id);
};

exports.get = async (id, options = {}) => {
  const filters = { _id: ObjectId(id), status: ReverseService.STATUS_ACTIVE };

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = ReverseService.STATUS_INACTIVE;

  const reverse = await ReverseService.findOne(filters);

  if (!reverse) return null;

  return this.mapData(reverse);
};

exports.update = async (id, data) => {
  data.date_updated = new Date();

  const reverse = await ReverseService.findByIdAndUpdate(
    { _id: ObjectId(id) },
    data
  );

  if (!reverse) return false;

  return await this.get(reverse._id);
};

exports.delete = async (id) => {
  const reverse = await ReverseService.findByIdAndUpdate(
    { _id: ObjectId(id) },
    {
      $set: { status: ReverseService.STATUS_INACTIVE },
    }
  );

  if (!reverse) return false;

  return await this.get(reverse._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
  const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

  const filters = { status: ReverseService.STATUS_ACTIVE };

  const results = await ReverseService.aggregate(this.pipeline(filters))
    .collation({ locale: "en" })
    .sort({ [sortBy]: sortOrderInt })
    .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
    .limit(pageLimit);

  const reverseData = results.map((o) => this.mapData(o));

  const reverseTotal = await ReverseService.countDocuments(filters);

  return { data: reverseData, total: reverseTotal };
};

exports.pipeline = (filters) => {
  return [
    {
      $lookup: {
        from: 'companies',
        localField: 'header.company_code',
        foreignField: '_id',
        as: 'company_code'
      },
    },
    { $unwind: '$company_code' },
    { $match: filters }
  ];
};

exports.mapData = (data) => {
  return {
    _id: data._id,
    header: {
      company_code: {
        _id: data.company_code._id,
        description: data.company_code.desc
      },
      company_code_to: data.header.company_code_to,
      document_number: data.header.document_number,
      document_number_to: data.header.document_number_to,
      fiscal_year: data.header.fiscal_year,
      fiscal_year_to: data.header.fiscal_year_to,
      document_type: data.header.document_type,
      document_type_to: data.header.document_type_to,
      ledger_group: data.header.ledger_group,
      ledger_group_to: data.header.ledger_group_to,
    },
    general_selections: data.general_selections,
    further_selections: data.further_selections,
    reverse_posting_details: data.reverse_posting_details,
    cross_company_code_transactions: data.cross_company_code_transactions,
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};
