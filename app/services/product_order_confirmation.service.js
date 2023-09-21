const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/product_order_confirmation.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      {
        "header.confirmation": confirmationSearch,
        "header.order": orderSearch,
        "header.operation": operationSearch,
        "header.sub_operation": subOperationSearch,
        "header.work_center": workCenterSearch,
        "header.material": materialSearch,
        "header.sequence": sequenceSearch,
        "header.plant": plantSearch,
        "header.confirm_type": confirmTypeSearch,
        "header.clear_open_reservations": clearOpenReservationsSearch,

        "window.date.personnel_no": personnelNoSearch,
        "window.date.work_center": workCenterDateSearch,
        "window.date.plant": plantDateSearch,
        "window.date.posting_date": postingDateSearch,
        "window.date.time_id": timeIdSearch,

        "window.quantity.yield": yieldSearch,
        "window.quantity.unit": unitSearch,
        "window.quantity.scrap": scrapSearch,
        "window.quantity.rework": reworkSearch,
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
        from: "material_types",
        localField: "header.material",
        foreignField: "_id",
        as: "material",
      },
    },
    {
      $unwind: {
        path: "$material",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "plants",
        localField: "header.plant",
        foreignField: "_id",
        as: "plant",
      },
    },
    {
      $unwind: {
        path: "$plant",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "plants",
        localField: "window.date.plant",
        foreignField: "_id",
        as: "plant",
      },
    },
    {
      $unwind: {
        path: "$plant",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $match: filters },
  ];
};
exports.mapData = (data) => {
  const { material, plant, plant2, plant3 } = data;

  return {
    _id: data._id,
    header: {
      confirmation: data.header.confirmation,
      order: data.header.order,
      operation: data.header.operation,
      sub_operation: data.header.sub_operation,
      work_center: data.header.work_center,
      material: material
        ? {
            _id: material._id,
            code: material.code,
            description: plant.desc,
          }
        : null,
      sequence: data.header.sequence,
      plant: plant
        ? {
            _id: plant._id,
            code: plant.code,
            description: plant.desc,
          }
        : null,
      confirm_type: data.header.confirm_type,
      clear_open_reservations: data.header.clear_open_reservations,
    },
    window: {
      date: {
        personnel_no: data.window.date.n,
        work_center: data.window.date.work_center,
        plant: plant2
          ? {
              _id: plant2._id,
              code: plant2.code,
              description: plant2.desc,
            }
          : null,
        posting_date: data.window.date.posting_date,
        time_id: data.window.date.time_id,
      },
      quantity: {
        yield: data.window.quantity.yield,
        unit: data.window.quantity.unit,
        scrap: data.window.quantity.scrap,
        rework: data.window.quantity.rework,
      },
    },
    status: data.status,
    date_created: data.date_created.toISOString().split("T")[0],
    date_updated: data.date_updated.toISOString().split("T")[0],
  };
};
