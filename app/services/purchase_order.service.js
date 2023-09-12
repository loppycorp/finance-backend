const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/purchase_order.model");

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

exports.pipeline = (filters) => {
    return [
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
                path: '$vendor',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'purchasing_groups',
                localField: 'window.org_data.purchasing_org',
                foreignField: '_id',
                as: 'purchasing_org'
            },
        },
        {
            $unwind: {
                path: '$purchasing_org',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'purchasing_groups',
                localField: 'window.org_data.purch_group',
                foreignField: '_id',
                as: 'purch_group'
            },
        },
        {
            $unwind: {
                path: '$purch_group',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'companies',
                localField: 'window.org_data.company_code',
                foreignField: '_id',
                as: 'company_code'
            },
        },
        {
            $unwind: {
                path: '$company_code',
                preserveNullAndEmptyArrays: true
            }
        },

        // ////////////////////////////////////////
        {
            $lookup: {
                from: 'companies',
                localField: 'window.account_assignments.co_code',
                foreignField: '_id',
                as: 'co_code'
            },
        },
        {
            $unwind: {
                path: '$co_code',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'gl_accounts',
                localField: 'window.account_assignments.gl_account',
                foreignField: '_id',
                as: 'co_code'
            },
        },
        {
            $unwind: {
                path: '$gl_account',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'controlling_areas',
                localField: 'window.account_assignments.co_area',
                foreignField: '_id',
                as: 'co_area'
            },
        },
        {
            $unwind: {
                path: '$co_area',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'cost_centers',
                localField: 'window.account_assignments.cost_center',
                foreignField: '_id',
                as: 'cost_center'
            },
        },
        {
            $unwind: {
                path: '$cost_center',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'order_types',
                localField: 'window.account_assignments.order',
                foreignField: '_id',
                as: 'order'
            },
        },
        {
            $unwind: {
                path: '$order',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'tax_codes',
                localField: 'window.invoice.tax_code',
                foreignField: '_id',
                as: 'tax_code'
            },
        },
        {
            $unwind: {
                path: '$tax_code',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'currencies',
                localField: 'condition.condition.currency',
                foreignField: '_id',
                as: 'currency'
            },
        },
        {
            $unwind: {
                path: '$currency',
                preserveNullAndEmptyArrays: true
            }
        },


        {
            $lookup: {
                from: 'currencies',
                localField: 'condition.items.curr',
                foreignField: '_id',
                as: 'curr'
            },
        },
        {
            $unwind: {
                path: '$curr',
                preserveNullAndEmptyArrays: true
            }
        },


        { $match: filters }
    ];
}; exports.mapData = (data) => {
    const { vendor, purchasing_org, purch_group, company_code, co_code, gl_account, co_area, cost_center, order
        , tax_code, currency, curr } = data;
    const itemsArray = Array.isArray(data.condition.items) ? data.condition.items : [];
    return {
        _id: data._id,
        header: {
            vendor: (vendor) ? {
                _id: vendor._id,
                code: vendor.header.vendor_code,
                name: vendor.address.name.name,
            } : null,
            doc_date: data.header.doc_date,
        },
        window: {
            org_data: {
                purchasing_org: (purchasing_org) ? {
                    _id: purchasing_org._id,
                    code: purchasing_org.code,
                    desc: purchasing_org.desc,
                } : null,
                purch_group: (purch_group) ? {
                    id: purch_group._id,
                    code: purch_group.code,
                    desc: purch_group.desc,
                } : null,
                company_code: (company_code) ? {
                    _id: company_code._id,
                    code: company_code.code,
                    name: company_code.company_name,
                    desc: company_code.desc,
                } : null,
            },
            additional_data: {
                validity_start: data.window.additional_data.validity_start,
                validity_end: data.window.additional_data.validity_end,
                collective_no: data.window.additional_data.collective_no
            },
            account_assignments: {
                acc_ass_cat: data.window.account_assignments.acc_ass_cat,
                distribution: data.window.account_assignments.distribution,
                co_code: (co_code) ? {
                    _id: co_code._id,
                    code: co_code.code,
                    name: co_code.company_name,
                    desc: co_code.desc,
                } : null,
                unloading_point: data.window.account_assignments.unloading_point,
                recipient: data.window.account_assignments.recipient,
                gl_account: (gl_account) ? {
                    _id: gl_account._id,
                    code: gl_account.header.gl_account_code,
                } : null,
                co_area: (co_area) ? {
                    _id: ledger._id,
                    name: ledger.name,
                    desc: ledger.desc,
                } : null,
                cost_center: (cost_center) ? {
                    _id: cost_center._id,
                    code: cost_center.header.cost_center_code,
                } : null,
                order: (order) ? {
                    _id: order._id,
                    type: order.type,
                    code: order.code,
                    name: order.name,
                } : null,
                network: data.window.account_assignments.network,
            },
            invoice: {
                tax_code: (tax_code) ? {
                    _id: tax_code._id,
                    code: tax_code.tax_code,
                } : null,
            },
        },
        condition: {
            condition: {
                qty: data.condition.qty,
                net: data.condition.net,
                currency: (currency) ? {
                    _id: currency._id,
                    code: currency.code,
                    name: currency.name,
                    desc: currency.desc,
                } : null,
            },
            items: itemsArray.map((o) => {
                return {
                    cnty: o.cnty,
                    name: o.name,
                    amount: o.amount,
                    per: o.per,
                    condition_value: o.condition_value,
                    curr: (curr) ? {
                        _id: curr._id,
                        code: curr.code,
                        name: curr.name,
                        desc: curr.desc,
                    } : null,
                    status: o.status,
                    numc: o.numc,
                    oun: o.oun,
                    cdcur: o.cdcur,
                };
            }),
        },
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0],
    };
};
