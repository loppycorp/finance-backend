const ObjectId = require('mongoose').Types.ObjectId;
const Internal_order = require('../models/internal_order.model');

exports.create = async (data) => {
    const internal_order = await Internal_order.create(data);

    if (!internal_order) return false;

    return await this.get(internal_order._id)
};
exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Internal_order.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Internal_order.STATUS_INACTIVE;

    const internal_order = await Internal_order.findOne(filters);

    if (!internal_order) return null;

    return this.mapData(internal_order);
};
exports.update = async (id, data) => {
    data.date_updated = new Date();

    const internal_order = await Internal_order.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!internal_order) return false;

    return await this.get(internal_order._id);
};
exports.delete = async (id) => {
    const internal_order = await Internal_order.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Internal_order.STATUS_INACTIVE }
    });

    if (!internal_order) return false;

    return await this.get(internal_order._id, { allowed_inactive: true });
};
exports.mapData = (data) => {
    return {
        _id: data._id,
        order_type: data.order_type,
        order: data.order,
        controlling_area: data.controlling_area,
        description: data.description,
        company_code: data.company_code,
        business_area: data.business_area,
        plant: data.plant,
        functional_area: data.functional_area,
        object_class: data.object_class,
        profit_center: data.profit_center,
        responsible_cctr: data.responsible_cctr,
        user_responsible: data.user_responsible,
        wbs_element: data.wbs_element,
        requesting_cctr: data.requesting_cctr,
        requesting_co_code: data.requesting_co_code,
        requesting_order: data.requesting_order,
        sales_order: data.sales_order,
        external_order_no: data.external_order_no,
        system_status: data.system_status,
        user_status: data.user_status,
        status_number: data.status_number,
        currency: data.currency,
        order_category: data.order_category,
        actual_posted_cctr: data.actual_posted_cctr,
        statistical_order: data.statistical_order,
        plan_integrated_order: data.plan_integrated_order,
        revenue_postings: data.revenue_postings,
        commitment_update: data.commitment_update,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};
exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Internal_order.STATUS_ACTIVE };

    const results = await Internal_order.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const internalOrderData = results.map(o => this.mapData(o));

    const internalOrderTotal = await Internal_order.countDocuments(options);

    return { data: internalOrderData, total: internalOrderTotal };
};

