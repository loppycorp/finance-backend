const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/sales_order.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      { "header.unit_sales": search },
      { "header.sold_to_party": search },
      { "header.po_number": search },
      { "header.po_date": search },
      { "header.net_value": search },
      { "sales.items.req_delv_date": search },
      { "sales.items.complete_dlv": search },
      { "sales.items.delivery_block": search },
      { "sales.items.payment_card": search },
      { "sales.items.card_verif_code": search },
      { "sales.items.payment_terms": search },
      { "sales.items.order_reason": search },
      { "sales.items.delivery_plant": search },
      { "sales.items.total_weight": search },
      { "sales.items.volume": search },
      { "sales.items.pricing_date": search },
      { "sales.items.exp_date": search },
      { "all_items.items.material": search },
      { "all_items.items.order_quantity": search },
      { "all_items.items.un": search },
      { "all_items.items.s": search },
      { "all_items.items.description": search },
      { "all_items.items.customer_material_numb": search },
      { "all_items.items.itca": search },
      { "all_items.items.hl_itm": search },
      { "all_items.items.d": search },
      { "all_items.items.first_date": search },
      { "all_items.items.plnt": search },
      { "all_items.items.batch": search },
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

// exports.getByCode = async (house_bank_code, existing_id) => {
//     const options = {
//         house_bank_code: house_bank_code,
//         status: DefaultModel.STATUS_ACTIVE,
//     };

//     if (existing_id && existing_id != "") options["_id"] = { $ne: existing_id };

//     return (await DefaultModel.countDocuments(options)) > 0;
// };

exports.pipeline = (filters) => {
  return [{ $match: filters }];
};
exports.mapData = (data) => {
  return {
    _id: data._id,
    header: data.header,
    sales: data.sales,
    all_items: data.all_items,
    status: data.status,
    date_created: data.date_created.toISOString().split("T")[0],
    date_updated: data.date_updated.toISOString().split("T")[0],
  };
};
