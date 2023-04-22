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
        // {
        //     $lookup: {
        //         from: 'controlling_areas',
        //         localField: 'controlling_area_id',
        //         foreignField: '_id',
        //         as: 'controlling_area'
        //     },
        // },
        // { $unwind: '$controlling_area' },
        // {
        //     $lookup: {
        //         from: 'customers',
        //         localField: 'account_control.customer_id',
        //         foreignField: '_id',
        //         as: 'customer'
        //     },
        // },
        // { $unwind: '$customer' },
        // {
        //     $lookup: {
        //         from: 'trading_partners',
        //         localField: 'account_control.trading_partner_id',
        //         foreignField: '_id',
        //         as: 'trading_partner'
        //     },
        // },
        // { $unwind: '$trading_partner' },
        // {
        //     $lookup: {
        //         from: 'authorizations',
        //         localField: 'account_control.authorization_id',
        //         foreignField: '_id',
        //         as: 'authorization'
        //     },
        // },
        // { $unwind: '$authorization' },
        // {
        //     $lookup: {
        //         from: 'corporate_groups',
        //         localField: 'account_control.corporate_group_id',
        //         foreignField: '_id',
        //         as: 'corporate_group'
        //     },
        // },
        // { $unwind: '$corporate_group' },
        // { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        vendor_id: data.vendor_id,
        vendor_code: data.vendor_code,
        company_code_id:data.company_code_id,
        account_management: {
            accounting_information: {
                recon_account: data.recon_account,
                head_office: data.head_office,
                authorization: data.authorization,
                minority_indic: data.minority_indic,
                sort_key: data.sort_key,
                cash_mgmnt_group: data.cash_mgmnt_group,
                release_group: data.release_group,
                certification_date: data.certification_date,

            },
            interest_calculation: {
                interest_indic: data.interest_indic,
                interest_freq: data.interest_freq,
                lastkey_date: data.lastkey_date,
                interest_run: data.interest_run,
            },
            reference_data: {
                prev_account_no: data.prev_account_no,
                personnel_number: data.personnel_number,
            },
        },
        payment_transactions: {
            payment_data: {
                payment_terms: data.payment_terms,
                chk_cashing_time: data.chk_cashing_time,
                tolerance_group_id: data.tolerance_group_id,
                chk_double_inv: data.chk_double_inv,
            },
            auto_payment_transactions: {
                payment_methods: data.payment_methods,
                alternate_payee: data.alternate_payee,
                individual_pmnt: data.individual_pmnt,
                exch_limit: data.exch_limit,
                pmnt_adv: data.pmnt_adv,
                payment_block: data.payment_block,
                house_bank: data.house_bank,
                grouping_key: data.grouping_key,
            },
            invoice_verification: {
                tolerance_group_id: data.tolerance_group_id,
            },
        },
        correspondence: {
            dunning_data: {
                dunn_procedure: data.dunn_procedure,
                dunn_recipient: data.dunn_recipient,
                last_dunned_date: data.last_dunned_date,
                dunning_clerk: data.dunning_clerk,
                dunn_block: data.dunn_block,
                legal_dunn_procedure: data.legal_dunn_procedure,
                dunn_level: data.dunn_level,
                grouping_key: data.grouping_key,
            },
            correspondences: {
                local_process: data.local_process,
                acct_clerk: data.acct_clerk,
                acct_vendor: data.acct_vendor,
                clerk_vendor: data.clerk_vendor,
                act_clk_tel_no: data.act_clk_tel_no,
                clerks_fax: data.clerks_fax,
                clerks_internet: data.clerks_internet,
                acct_memo: data.acct_memo,
            },
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};