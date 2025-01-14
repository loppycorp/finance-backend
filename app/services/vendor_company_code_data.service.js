const ObjectId = require('mongoose').Types.ObjectId;
const Vendor = require('../models/vendor_company_code_data.model');

exports.search = async (searchTerm, options = {}) => {
    const filters = { status: Vendor.STATUS_ACTIVE };

    if (searchTerm) {
        const search = new RegExp(options.search, 'i');
        filters.$or = [
            { "header.vendor": search },
            { "header.company_code": search },
            { "account_management.accounting_information.recon_account": search },
            { "account_management.accounting_information.head_office": search },
            { "account_management.accounting_information.authorization": search },
            { "account_management.accounting_information.minority_indic": search },
            { "account_management.accounting_information.sort_key": search },
            { "account_management.accounting_information.cash_mgmnt_group": search },
            { "account_management.accounting_information.release_group": search },
            { "account_management.accounting_information.certification_date": search },
            { "account_management.interest_calculation.interest_indic": search },
            { "account_management.interest_calculation.interest_freq": search },
            { "account_management.interest_calculation.lastkey_date": search },
            { "account_management.interest_calculation.interest_run": search },
            { "account_management.reference_data.prev_account_no": search },
            { "account_management.reference_data.personnel_number": search },
            { "payment_transactions.payment_data.payment_terms": search },
            { "payment_transactions.payment_data.chk_cashing_time": search },
            { "payment_transactions.payment_data.tolerance_groups": search },
            { "payment_transactions.payment_data.chk_double_inv": search },
            { "payment_transactions.auto_payment_transactions.payment_methods": search },
            { "payment_transactions.auto_payment_transactions.alternate_payee": search },
            { "payment_transactions.auto_payment_transactions.individual_pmnt": search },
            { "payment_transactions.auto_payment_transactions.exch_limit": search },
            { "payment_transactions.auto_payment_transactions.pmnt_adv": search },
            { "payment_transactions.auto_payment_transactions.payment_block": search },
            { "payment_transactions.auto_payment_transactions.house_bank": search },
            { "payment_transactions.auto_payment_transactions.grouping_key": search },
            { "payment_transactions.invoice_verification.tolerance_group": search },
            { "correspondence.dunning_data.dunn_procedure": search },
            { "correspondence.dunning_data.dunn_recipient": search },
            { "correspondence.dunning_data.last_dunned_date": search },
            { "correspondence.dunning_data.dunning_clerk": search },
            { "correspondence.dunning_data.dunn_block": search },
            { "correspondence.dunning_data.legal_dunn_procedure": search },
            { "correspondence.dunning_data.dunn_level": search },
            { "correspondence.dunning_data.grouping_key": search },
            { "correspondence.correspondences.local_process": search },
            { "correspondence.correspondences.acct_clerk": search },
            { "correspondence.correspondences.acct_vendor": search },
            { "correspondence.correspondences.clerk_vendor": search },
            { "correspondence.correspondences.act_clk_tel_no": search },
            { "correspondence.correspondences.clerks_fax": search },
            { "correspondence.correspondences.clerks_internet": search },
            { "correspondence.correspondences.acct_memo": search },
            { "with_tax_information.with_tax_information.wth_t_ty": search },
            { "with_tax_information.with_tax_information.w_tax_c": search },
            { "with_tax_information.with_tax_information.liable": search },
            { "with_tax_information.with_tax_information.rec_ty": search },
            { "with_tax_information.with_tax_information.w_tax_id": search },
            { "with_tax_information.with_tax_information.exemption_number": search },
            { "with_tax_information.with_tax_information.exem": search },
            { "with_tax_information.with_tax_information.exmpt_r": search },
            { "with_tax_information.with_tax_information.exempt_form": search },
            { "with_tax_information.with_tax_information.exempt_to": search },
            { "with_tax_information.with_tax_information.description": search }

        ];
    }

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Vendor.STATUS_INACTIVE;

    const results = await Vendor.aggregate(this.pipeline(filters));

    const mappedResults = results.map(result => this.mapData(result));

    return { data: mappedResults, total: mappedResults.length };
};

exports.create = async (data) => {
    const vendor = await Vendor.create(data);

    if (!vendor) return false;

    return await this.get(vendor._id)
};

exports.get = async (id, options = {}) => {
    const record = await Vendor.aggregate(this.pipeline({
        _id: ObjectId(id),
        status: (options.display_inactive === true)
            ? Vendor.STATUS_INACTIVE
            : Vendor.STATUS_ACTIVE
    }));

    if (!record[0]) return false;

    return this.mapData(record[0]);
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
                localField: 'header.company_code',
                foreignField: '_id',
                as: 'company_code'
            },
        },
        { $unwind: '$company_code' },
        {
            $lookup: {
                from: 'tolerance_groups',
                localField: 'payment_transactions.payment_data.tolerance_groups',
                foreignField: '_id',
                as: 'tolerance_groups'
            },
        },
        {
            $unwind: {
                path: "$tolerance_groups",
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
            vendor: data.vendor,
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
                tolerance_groups: (data.payment_transactions.payment_data.tolerance_groups) ? {
                    _id: data.tolerance_groups._id,
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
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0]
    };
};