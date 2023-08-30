const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/internal_order.model");

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
  const defaultModel = results[0];

  if (!defaultModel) return null;

  return this.mapData(defaultModel);
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
  const options = { "header.order": code, status: DefaultModel.STATUS_ACTIVE, };

  if (existing_id && existing_id != "")
    options["_id"] = { $ne: existing_id };

  return (await DefaultModel.countDocuments(options)) > 0;
};

exports.pipeline = (filters) => {
  return [
    {
      $lookup: {
        from: 'order_types',
        localField: 'header.order_type',
        foreignField: '_id',
        as: 'order_type',
      },
    },
    // if the id is required
    { $unwind: '$order_type', },
    {
      $lookup: {
        from: 'controlling_areas',
        localField: 'header.controlling_area',
        foreignField: '_id',
        as: 'controlling_area',
      },
    },
    // if the id is required
    { $unwind: '$controlling_area', },
    {
      $lookup: {
        from: 'companies',
        localField: 'assignments.company_code',
        foreignField: '_id',
        as: 'company_code',
      },
    },
    // if the id is optional or nullable
    { $unwind: '$company_code', },

    {
      $lookup: {
        from: 'profit_centers',
        localField: 'assignments.profit_center',
        foreignField: '_id',
        as: 'profit_center',
      },
    },
    // if the id is optional or nullable
    { $unwind: '$profit_center', },

    {
      $lookup: {
        from: 'currencies',
        localField: 'control_data.control_data.currency',
        foreignField: '_id',
        as: 'currency',
      },
    },
    // if the id is optional or nullable
    { $unwind: '$currency', },

    { $match: filters },
  ];
};
exports.mapData = (data) => {
  return {
    _id: data._id,
    header: {
      order_type: {
        _id: data.order_type._id,
        type: data.order_type.typee,
        code: data.order_type.code,
        name: data.order_type.name,
      },
      order: data.header.order,
      controlling_area:
      {
        _id: data.controlling_area._id,
      },
      description: data.header.description,
    },
    assignments: {
      company_code: {
        _id: data.company_code._id,
        code: data.company_code.code,
        description: data.company_code.desc
      },
      business_area: data.assignments.business_area,
      plant: data.assignments.plant,
      functional_area: data.assignments.functional_area,
      object_class: data.assignments.object_class,
      profit_center: {
        _id: data.profit_center.basic_data.description._id,
        code: data.profit_center.basic_data.description.profit_center_code,
        description: data.profit_center.basic_data.description.name
      },
      responsible_cctr: data.assignments.responsible_cctr,
      user_responsible: data.assignments.user_responsible,
      wbs_element: data.assignments.wbs_element,
      requesting_cctr: data.assignments.requesting_cctr,
      requesting_co_code: data.assignments.requesting_co_code,
      requesting_order: data.assignments.equesting_order,
      sales_order: data.assignments.sales_order,
      external_order_no: data.assignments.external_order_no,
    },
    control_data: {
      status: {
        system_status: data.control_data.system_status,
        user_status: data.control_data.user_status,
        status_number: data.control_data.status_number,
      },
      control_data: {
        currency: {
          _id: data.currency._id,
          code: data.currency.code,
          name: data.currency.name,
          description: data.currency.desc,
        },
        order_category: data.control_data.control_data.order_category,
        actual_posted_cctr: data.control_data.control_data.actual_posted_cctr,
        statistical_order: data.control_data.control_data.statistical_order,
        plan_integrated_order: data.control_data.control_data.plan_integrated_order,
        revenue_postings: data.control_data.control_data.revenue_postings,
        commitment_update: data.control_data.control_data.commitment_update,
      }
    },
    status: data.status,
    date_created: data.date_created.toISOString().split('T')[0],
    date_updated: data.date_updated.toISOString().split('T')[0],
  };
};
