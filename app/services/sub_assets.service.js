const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/sub_assets.model");

exports.create = async (data) => {
  const dftModel = await DefaultModel.create(data);

  if (!dftModel) return false;

  return await this.get(dftModel._id);
};
exports.get = async (id, options = {}) => {
  const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

  if (options.allowed_inactive && options.allowed_inactive == true)
    filters.status = DefaultModel.STATUS_INACTIVE;

  const results = await DefaultModel.aggregate(this.pipeline(filters))
  const dftModel = results[0];

  if (!dftModel) return null;

  return this.mapData(dftModel);
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
  const options = { "header.asset_class": code, status: DefaultModel.STATUS_ACTIVE, };

  if (existing_id && existing_id != "")
    options["_id"] = { $ne: existing_id };

  return (await DefaultModel.countDocuments(options)) > 0;
};

exports.pipeline = (filters) => {
  return [
    {
      $lookup: {
        from: 'companies',
        localField: 'header.company_code_id',
        foreignField: '_id',
        as: 'company_code_id',
      },
    },
    // if the id is required
    { $unwind: '$company_code_id', },
    { $match: filters },
  ];
};
exports.mapData = (data) => {
  return {
    _id: data._id,
    header:{
        asset_class: data.header.asset_class,
        company_code_id: { 
            _id: data.company_code_id._id,
            code: data.company_code_id.code,
            description: data.company_code_id.desc
        },
        number_of_similar_assets: data.header.number_of_similar_assets,
        class: data.header.class,
        post_capitalization: data.header.post_capitalization,
      },
        general: {
          general_data: {
            description: data.general.general_data.description,
            asset_main_no: data.general.general_data.asset_main_no,
            acct_determination: data.general.general_data.acct_determination,
            serial_number: data.general.general_data.serial_number,
            inventory_number: data.general.general_data.inventory_number,
            quantity: data.general.general_data.quantity,
            manage_historically: data.general.general_data.manage_historically,
          },
          inventory: {
            last_inventory_on: data.general.inventory.last_inventory_on,
            inventory_note: data.general.inventory.inventory_note,
            include_asset_in_inventory_list: data.general.inventory.include_asset_in_inventory_list,
          },
          posting_information: {
            capitalized_on: data.general.posting_information.capitalized_on,
            first_acquisition_on: data.general.posting_information.first_acquisition_on,
            acquisition_year: data.general.posting_information.acquisition_year,
            deactivation_on: data.general.posting_information.deactivation_on,
          },
        },
    status: data.status,
    date_created: data.date_created,
    date_updated: data.date_updated,
  };
};