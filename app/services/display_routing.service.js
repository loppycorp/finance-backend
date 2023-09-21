const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/display_routing.model");

exports.search = async (searchTerm, options = {}) => {
  const filters = { status: DefaultModel.STATUS_ACTIVE };

  if (searchTerm) {
    const search = new RegExp(options.search, "i");
    filters.$or = [
      {
        "header.material": search,
        "header.plant": search,
        "header.sales_document": search,
        "header.sales_document_item": search,
        "header.wbs_elemet": search,
        "header.sequence": search,

        "window.validity.change_number": search,
        "window.validity.key_date": search,
        "window.validity.revision_level": search,
        "window.additional_criteria_for_list_selection.plant": search,
        "window.additional_criteria_for_list_selection.group_counter": search,
        "window.additional_criteria_for_list_selection.task_list_status":
          search,
        "window.additional_criteria_for_list_selection.planner_group": search,

        "items.operation_overview.op": search,
        "items.operation_overview.sop": search,
        "items.operation_overview.work_ce": search,
        "items.operation_overview.plnt": search,
        "items.operation_overview.co": search,
        "items.operation_overview.standard": search,
        "items.operation_overview.description": search,
        "items.operation_overview.lo": search,
        "items.operation_overview.p": search,
        "items.operation_overview.ci": search,
        "items.operation_overview.o": search,
        "items.operation_overview.pe": search,
        "items.operation_overview.c": search,
        "items.operation_overview.su": search,
        "items.operation_overview.bas": search,
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
        localField: "window.additional_criteria_for_list_selection.plant",
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
        localField: "items.operation_overview.plnt",
        foreignField: "_id",
        as: "plant",
      },
    },
    {
      $unwind: {
        path: "$plnt",
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
      material: material
        ? {
            _id: material._id,
            code: material.code,
            description: plant.desc,
          }
        : null,
      plant: plant
        ? {
            _id: plant._id,
            code: plant.code,
            description: plant.desc,
          }
        : null,
      sales_document: data.header.sales_document,
      sales_document_item: data.header.sales_document_item,
      wbs_elemet: data.header.wbs_elemet,
      sequence: data.header.sequence,
    },
    window: {
      validity: {
        change_number: data.window.validity.change_number,
        key_date: data.window.validity.key_date,
        revision_level: data.window.validity.revision_level,
      },
      additional_criteria_for_list_selection: {
        plant: plant2
          ? {
              _id: plant2._id,
              code: plant2.code,
              description: plant2.desc,
            }
          : null,
        group_counter:
          data.window.additional_criteria_for_list_selection.group_counter,
        task_list_status:
          data.window.additional_criteria_for_list_selection.task_list_status,
        planner_group:
          data.window.additional_criteria_for_list_selection.planner_group,
      },
    },
    items: {
      operation_overview: {
        op: data.items.operation_overview.op,
        sop: data.items.operation_overview.sop,
        work_ce: data.items.operation_overview.work_ce,
        plnt: plant3
          ? {
              _id: plant3._id,
              code: plant3.code,
              description: plant3.desc,
            }
          : null,
        co: data.items.operation_overview.co,
        standard: data.items.operation_overview.standard,
        description: data.items.operation_overview.description,
        lo: data.items.operation_overview.lo,
        p: data.items.operation_overview.p,
        ci: data.items.operation_overview.ci,
        o: data.items.operation_overview.o,
        pe: data.items.operation_overview.pe,
        c: data.items.operation_overview.c,
        su: data.items.operation_overview.su,
        bas: data.items.operation_overview.bas,
      },
    },
    status: data.status,
    date_created: data.date_created.toISOString().split("T")[0],
    date_updated: data.date_updated.toISOString().split("T")[0],
  };
};
