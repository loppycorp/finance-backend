const ObjectId = require('mongoose').Types.ObjectId;
const Vendor = require('../models/vendor_company_code_data.model');

exports.create = async (data) => {
    const vendor = await Vendor.create(data);

    if (!vendor) return false;

    return await this.get(vendor._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Vendor.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Vendor.STATUS_INACTIVE;

    const results = await Vendor.aggregate(this.pipeline(filters))
    const vendor = results[0];

    if (!vendor) return null;

    return this.mapData(vendor);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const vendor = await Vendor.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!vendor) return false;

    return await this.get(vendor._id);
};

exports.delete = async (id) => {
    const vendor = await Vendor.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Vendor.STATUS_INACTIVE }
    });

    if (!vendor) return false;

    return await this.get(vendor._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: Vendor.STATUS_ACTIVE };

    const results = await Vendor.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const vendorData = results.map(o => this.mapData(o));

    const vendorTotal = await Vendor.countDocuments(filters);

    return { data: vendorData, total: vendorTotal };
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
        {
            $lookup: {
                from: 'tolerance_groups',
                localField: 'payment_transactions.payment_data.tolerance_group',
                foreignField: '_id',
                as: 'tolerance_group'
            },
        },
        {
            $unwind: {
                path: "$tolerance_group",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'tolerance_groups',
                localField: 'payment_transactions.invoice_verification.tolerance_group',
                foreignField: '_id',
                as: 'tolerance_group'
            },
        },
        {
            $unwind: {
                path: "$tolerance_group",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'house_banks',
                localField: 'payment_transactions.auto_payment_transactions.house_bank',
                foreignField: '_id',
                as: 'house_bank'
            },
        },
        {
            $unwind: {
                path: "$house_bank",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'cash_mgmnt_groups',
                localField: 'account_management.accounting_information.cash_mgmnt_group',
                foreignField: '_id',
                as: 'cash_mgmnt_group'
            },
        },
        {
            $unwind: {
                path: "$cash_mgmnt_group",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'release_groups',
                localField: 'account_management.accounting_information.release_group',
                foreignField: '_id',
                as: 'release_group'
            },
        },
        {
            $unwind: {
                path: "$release_group",
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            vendor_code: data.vendor_code,
            company_code: data.company_code,
        },
        account_management: {
            accounting_information: {
                recon_account: data.account_management.accounting_information.recon_account,
                head_office: data.account_management.accounting_information.head_office,
                authorization: data.account_management.accounting_information.authorization,
                minority_indic: data.account_management.accounting_information.minority_indic,
                sort_key: data.account_management.accounting_information.sort_key,
                cash_mgmnt_group: (data.account_management.accounting_information.cash_mgmnt_group) ? {
                    _id: data.cash_mgmnt_group._id
                } : null,
                release_group: (data.account_management.accounting_information.release_group) ? {
                    _id: data.release_group._id
                } : null,
                certification_date: data.account_management.accounting_information.certification_date,

            },
            interest_calculation: data.account_management.interest_calculation,
            reference_data: data.account_management.reference_data
        },
        payment_transactions: {
            payment_data: {
                payment_terms: data.payment_transactions.payment_data.payment_terms,
                chk_cashing_time: data.payment_transactions.payment_data.chk_cashing_time,
                tolerance_group: (data.payment_transactions.payment_data.tolerance_group)
                    ? {
                        _id: data.tolerance_group._id,
                        code: data.tolerance_group.code,
                        desc: data.tolerance_group.desc
                    } : null,
                chk_double_inv: data.payment_transactions.payment_data.chk_double_inv,
            },
            auto_payment_transactions: {
                payment_methods: data.payment_transactions.auto_payment_transactions.payment_methods,
                alternate_payee: data.payment_transactions.auto_payment_transactions.alternate_payee,
                individual_pmnt: data.payment_transactions.auto_payment_transactions.individual_pmnt,
                exch_limit: data.payment_transactions.auto_payment_transactions.exch_limit,
                pmnt_adv: data.payment_transactions.auto_payment_transactions.pmnt_adv,
                payment_block: data.payment_transactions.auto_payment_transactions.payment_block,
                house_bank: (data.payment_transactions.auto_payment_transactions.house_bank) ? {
                    _id: data.house_bank._id
                } : null,
                grouping_key: data.payment_transactions.auto_payment_transactions.grouping_key,
            },
            invoice_verification: {
                tolerance_group: (data.payment_transactions.invoice_verification.tolerance_group) ? {
                    _id: data.tolerance_group._id
                } : null
            },
        },
        correspondence: {
            dunning_data: data.correspondence.dunning_data,
            correspondences: data.correspondence.correspondences,
        },
        with_tax_information: {
            with_tax_information: data.with_tax_information.with_tax_information
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};