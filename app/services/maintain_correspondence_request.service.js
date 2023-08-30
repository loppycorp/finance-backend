const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/maintain_correspondence_request.model");

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
                from: 'customer_general_datas',
                localField: 'header.customer',
                foreignField: '_id',
                as: 'customer'
            },
        },
        {
            $unwind: {
                path: "$customer",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'vendor_general_datas',
                localField: 'header.vendor',
                foreignField: '_id',
                as: 'vendor'
            },
        },
        {
            $unwind: {
                path: "$vendor",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'general_selections.general_selections.company_code',
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
                from: 'companies',
                localField: 'general_selections.general_selections.company_code_to',
                foreignField: '_id',
                as: 'company_code'
            },
        },
        {
            $unwind: {
                path: "$company_code_to",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'fiscal_periods',
                localField: 'general_selections.general_selections.fiscal_year',
                foreignField: '_id',
                as: 'fiscal_year'
            },
        },
        {
            $unwind: {
                path: "$fiscal_year",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'fiscal_periods',
                localField: 'general_selections.general_selections.fiscal_year_to',
                foreignField: '_id',
                as: 'fiscal_year'
            },
        },
        {
            $unwind: {
                path: "$fiscal_year_to",
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters },
    ];
};

exports.mapData = (data) => {
    const { fiscal, company, company1, company2, customer, vendor } = data;

    return {

        _id: data._id,
        header: {
            company_code: (company) ? {
                _id: company._id,
                code: company.code,
                name: company.company_name,
                description: company.desc
            } : null,
            customer: (customer) ? {
                _id: customer._id,
                code: customer.header.customer_code,
                name: customer.address.name.name
            } : null,
            vendor: (vendor) ? {
                _id: vendor._id,
                code: vendor.header.vendor_code,
                name: vendor.address.name.name
            } : null,
            oi_key_date: data.header.oi_key_date
        },
        general_selections: {
            general_selections: {
                correspondence: data.general_selections.general_selections.correspondence,
                correspondence_to: data.general_selections.general_selections.correspondence_to,
                company_code: (company1) ? {
                    _id: company1._id,
                    code: company1.code,
                    name: company1.company_name,
                    description: company1.desc
                } : null,
                company_code_to: (company2) ? {
                    _id: company2._id,
                    code: company2.code,
                    name: company2.company_name,
                    description: company2.desc
                } : null,
                account_type: data.general_selections.general_selections.account_type,
                account_type_to: data.general_selections.general_selections.account_type_to,
                open_item_account: data.general_selections.general_selections.open_item_account,
                open_item_account_to: data.general_selections.general_selections.open_item_account_to,
                document_number: data.general_selections.general_selections.document_number,
                document_number_to: data.general_selections.general_selections.document_number_to,
                fiscal_year: (fiscal) ? {
                    _id: fiscal._id,
                    period: fiscal.period,
                    name: fiscal.name,
                } : null,
                fiscal_year_to: (fiscal) ? {
                    _id: fiscal._id,
                    period: fiscal.period,
                    name: fiscal.name,
                } : null,
                user: data.general_selections.general_selections.user,
                user_to: data.general_selections.general_selections.user_to,
                date_of_request: data.general_selections.general_selections.date_of_request,
                date_of_request_to: data.general_selections.general_selections.date_of_request_to,
                time_of_request: data.general_selections.general_selections.time_of_request,
                time_of_request_to: data.general_selections.general_selections.time_of_request_to,
                print_date: data.general_selections.general_selections.print_date,
                print_date_to: data.general_selections.general_selections.print_date_to,
                cash_journal_number: data.general_selections.general_selections.cash_journal_number,
                cash_journal_number_to: data.general_selections.general_selections.cash_journal_number_to,
            },
        },
        further_selections: data.further_selections,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated,
    };
};
