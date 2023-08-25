const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/monthly_utilization.model");

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
                from: 'plants',
                localField: 'header.plant',
                foreignField: '_id',
                as: 'plant'
            },
        },
        {
            $unwind: {
                path: "$plant",
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters },
    ];
};

exports.mapData = (data) => {
    const { company_code, plant } = data;

    return {

        _id: data._id,
        header: {
            company_code: (company_code) ? {
                _id: company_code._id,
                code: company_code.code,
                company_name: company_code.company_name,
                description: company_code.desc
            } : null,
            plant: (plant) ? {
                _id: plant._id,
                code: plant.code,
                description: plant.desc
            } : null,
            eexcise_group: data.eexcise_group,
            sub_transaction_type: data.sub_transaction_type,
            adc_sub_transation_type: data.adc_sub_transation_type,
            period: data.period,
            to: data.to,
            excise_invoice: data.excise_invoice,
            to: data.to,
            business_area: data.business_area,
            fortnightly_pymt_posting_date: data.fortnightly_pymt_posting_date,
            pay_cenvat_from_ser_tax_cr: data.pay_cenvat_from_ser_tax_cr,
            pay_ser_tax_from_cenvat_cr: data.pay_ser_tax_from_cenvat_cr,
            service_tax_credit_account: data.service_tax_credit_account,
            secess_on_ser_tax_account: data.secess_on_ser_tax_account,
            service_tax_payable_account: data.service_tax_payable_account,
            ecs_on_ser_payable_account: data.ecs_on_ser_payable_account,
            secess_on_ser_payable_account: data.secess_on_ser_payable_account,
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated,
    };
};
