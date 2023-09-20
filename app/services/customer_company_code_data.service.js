const ObjectId = require('mongoose').Types.ObjectId;
const DefaultModel = require('../models/customer_company_code_data.model');
exports.search = async (searchTerm, options = {}) => {
    const filters = { status: DefaultModel.STATUS_ACTIVE };

    if (searchTerm) {
        const search = new RegExp(options.search, 'i');
        filters.$or = [
            { "header.customer_code": search },
            { "header.company_code": search },
            { "account_management.accounting_information.recon_account": search },
            { "account_management.accounting_information.head_office": search },
            { "account_management.accounting_information.authorization": search },
            { "account_management.accounting_information.sort_key": search },
            { "account_management.accounting_information.cash_mgmnt_group": search },
            { "account_management.accounting_information.value_adjustment": search },
            { "account_management.interest_calculation.interest_indic": search },
            { "account_management.interest_calculation.interest_freq": search },
            { "account_management.interest_calculation.lastkey_date": search },
            { "account_management.interest_calculation.interest_run": search },
            { "account_management.reference_data.prev_account_no": search },
            { "account_management.reference_data.personnel_number": search },
            { "account_management.reference_data.buying_group": search },
            { "payment_transactions.payment_data.payment_terms": search },
            { "payment_transactions.payment_data.charges_payment_terms": search },
            { "payment_transactions.payment_data.check_paid_time": search },
            { "payment_transactions.payment_data.tolerance_group": search },
            { "payment_transactions.payment_data.leave": search },
            { "payment_transactions.payment_data.pleding_ind": search },
            { "payment_transactions.payment_data.payment_history": search },
            { "payment_transactions.auto_payment_transactions.payment_methods": search },
            { "payment_transactions.auto_payment_transactions.alternate_payee": search },
            { "payment_transactions.auto_payment_transactions.exch_limit": search },
            { "payment_transactions.auto_payment_transactions.single_payment": search },
            { "payment_transactions.auto_payment_transactions.pmnt_adv": search },
            { "payment_transactions.auto_payment_transactions.payment_block": search },
            { "payment_transactions.auto_payment_transactions.house_bank": search },
            { "payment_transactions.auto_payment_transactions.grouping_key": search },
            { "payment_transactions.auto_payment_transactions.next_payee": search },
            { "payment_transactions.auto_payment_transactions.lockbox": search },
            { "payment_transactions.payment_advice.rsn_code": search },
            { "payment_transactions.payment_advice.selection_rule": search },
            { "correspondence.dunning_data.dunn_procedure": search },
            { "correspondence.dunning_data.dunn_recipient": search },
            { "correspondence.dunning_data.last_dunned_date": search },
            { "correspondence.dunning_data.dunning_clerk": search },
            { "correspondence.dunning_data.dunn_block": search },
            { "correspondence.dunning_data.legal_dunn_procedure": search },
            { "correspondence.dunning_data.dunn_level": search },
            { "correspondence.dunning_data.grouping_key": search },
            { "correspondence.correspondences.acct_clerk": search },
            { "correspondence.correspondences.acct_customer": search },
            { "correspondence.correspondences.customer_user": search },
            { "correspondence.correspondences.act_clk_tel_no": search },
            { "correspondence.correspondences.clerks_fax": search },
            { "correspondence.correspondences.clerks_internet": search },
            { "correspondence.correspondences.acct_memo": search },
            { "correspondence.correspondences.bank": search },
            { "correspondence.correspondences.invoice": search },
            { "correspondence.correspondences.decentralized": search },
            { "correspondence.payment_notices.customer_with": search },
            { "correspondence.payment_notices.customer_without": search },
            { "correspondence.payment_notices.sales": search },
            { "correspondence.payment_notices.accounting": search },
            { "correspondence.payment_notices.legal_department": search },
            { "with_holding_tax.with_tax_information.wth_t_ty": search },
            { "with_holding_tax.with_tax_information.w_tax_c": search },
            { "with_holding_tax.with_tax_information.w_tax": search },
            { "with_holding_tax.with_tax_information.oblig_form": search },
            { "with_holding_tax.with_tax_information.oblig_to": search },
            { "with_holding_tax.with_tax_information.w_tax_number": search },
            { "with_holding_tax.with_tax_information.name": search }

        ];
    }

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = DefaultModel.STATUS_INACTIVE;

    const results = await DefaultModel.aggregate(this.pipeline(filters));

    const mappedResults = results.map(result => this.mapData(result));

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

    const results = await DefaultModel.aggregate(this.pipeline(filters))
    const defaultModel = results[0];

    if (!defaultModel) return null;

    return this.mapData(defaultModel);
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

    const options = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(options))
        .collation({ locale: "en" })
        .sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? (pageNum - 1) * pageLimit : 0)
        .limit(pageLimit);

    const defaultVariableData = results.map((o) => this.mapData(o));

    const defaultVariableTotal = await DefaultModel.countDocuments(options);

    return { data: defaultVariableData, total: defaultVariableTotal };
};

exports.getByCode = async (code, existing_id) => {
    const options = { 'header.customer_code': code, status: DefaultModel.STATUS_ACTIVE, };

    if (existing_id && existing_id != "")
        options["_id"] = { $ne: existing_id };

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
        { $unwind: '$company_code' },
        ////
        {
            $lookup: {
                from: 'cash_mgmnt_groups',
                localField: 'account_management.accounting_information.cash_mgmnt_group',
                foreignField: '_id',
                as: 'cash_mgmnt_group'
            },
        },
        {
            $lookup: {
                from: 'buying_groups',
                localField: 'account_management.reference_data.buying_group',
                foreignField: '_id',
                as: 'buying_group'
            },
        },
        {
            $lookup: {
                from: 'tolerance_groups',
                localField: 'control_data.account_control.tolerance_group',
                foreignField: '_id',
                as: 'corporate_group'
            },
        },
        {
            $lookup: {
                from: 'house_banks',
                localField: 'payment_transactions.auto_payment_transactions.house_bank',
                foreignField: '_id',
                as: 'house_bank'
            },
        },
        // { $unwind: '$corporate_group' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            customer_code: data.header.customer_code,
            company_code: {
                _id: data.company_code._id
            },
        },
        account_management: {
            accounting_information: {
                recon_account: data.account_management.accounting_information.recon_account,
                head_office: data.account_management.accounting_information.head_office,
                authorization: data.account_management.accounting_information.authorization,
                sort_key: data.account_management.accounting_information.sort_key,
                cash_mgmnt_group: (data.account_management.accounting_information.cash_mgmnt_group) ? {
                    _id: data.cash_mgmnt_group._id
                } : null,
                value_adjustment: data.account_management.accounting_information.value_adjustment,

            },
            interest_calculation: data.account_management.interest_calculation,
            reference_data: {
                prev_account_no: data.account_management.reference_data.prev_account_no,
                personnel_number: data.account_management.reference_data.personnel_number,
                buying_group: (data.account_management.reference_data.buying_group) ? {
                    _id: data.account_group._id
                } : null,

            },
        },
        payment_transactions: {
            payment_data: {
                payment_terms: data.payment_transactions.payment_data.payment_terms,
                charges_payment_terms: data.payment_transactions.payment_data.charges_payment_terms,
                check_paid_time: data.payment_transactions.payment_data.check_paid_time,
                tolerance_group: (data.payment_transactions.payment_data.tolerance_group) ? {
                    _id: data.tolerance_group._id
                } : null,
                leave: data.payment_transactions.payment_data.leave,
                pleding_ind: data.payment_transactions.payment_data.pleding_ind,
                payment_history: data.payment_transactions.payment_data.payment_history,
            },
            auto_payment_transactions: {
                payment_methods: data.payment_transactions.auto_payment_transactions.payment_methods,
                alternate_payee: data.payment_transactions.auto_payment_transactions.alternate_payee,
                exch_limit: data.payment_transactions.auto_payment_transactions.exch_limit,
                single_payment: data.payment_transactions.auto_payment_transactions.single_payment,
                pmnt_adv: data.payment_transactions.auto_payment_transactions.pmnt_adv,
                payment_block: data.payment_transactions.auto_payment_transactions.payment_block,
                house_bank: (data.payment_transactions.auto_payment_transactions.house_bank) ? {
                    _id: data.house_bank._id
                } : null,
                grouping_key: data.payment_transactions.auto_payment_transactions.grouping_key,
                next_payee: data.payment_transactions.auto_payment_transactions.next_payee,
                lockbox: data.payment_transactions.auto_payment_transactions.lockbox,

            },
            payment_advice: data.payment_transactions.payment_advice,
        },
        correspondence: {
            dunning_data: data.correspondence.dunning_data,
            correspondences: data.correspondence.correspondences,
            payment_notices: data.correspondence.payment_notices,
        },
        with_holding_tax: {
            with_tax_information: data.with_holding_tax.with_tax_information,
        },
        status: data.status,
        date_created: data.date_created.toISOString().split('T')[0],
        date_updated: data.date_updated.toISOString().split('T')[0]
    };
};