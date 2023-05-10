const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    header: {
        customer_code: Joi.number().required(),
        company_code: Joi.string().trim().required().hex().length(24),
    },
    account_management: {
        accounting_information: {
            recon_account: Joi.number().required(),
            head_office: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            authorization: Joi.number().required().allow(''),
            sort_key: Joi.number().required().allow(''),
            cash_mgmnt_group: Joi.string().trim().required().hex().length(24).allow(null),
            value_adjustment: Joi.number().required().allow(''),

        },
        interest_calculation: {
            interest_indic: Joi.number().required().allow(''),
            interest_freq: Joi.number().required().allow(''),
            lastkey_date: Joi.date().required().allow(''),
            interest_run: Joi.date().required().allow(''),
        },
        reference_data: {
            prev_account_no: Joi.number().required().allow(''),
            personnel_number: Joi.number().required().allow(''),
            buying_group: Joi.string().trim().required().hex().length(24).allow(null),

        },
    },
    payment_transactions: {
        payment_data: {
            payment_terms: Joi.number().required().allow(''),
            charges_payment_terms: Joi.number().required().allow(''),
            check_paid_time: Joi.date().required().allow(''),
            tolerance_group: Joi.string().trim().required().hex().length(24).allow(null),
            leave: Joi.number().required().allow(''),
            pleding_ind: Joi.number().required().allow(''),
            payment_history: Joi.boolean().required().allow(''),
        },
        auto_payment_transactions: {
            payment_methods: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            alternate_payee: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            exch_limit: Joi.number().required().allow(''),
            single_payment: Joi.boolean().required().allow(''),
            pmnt_adv: Joi.boolean().required().allow(''),
            payment_block: Joi.number().required().allow(''),
            house_bank: Joi.string().trim().required().hex().length(24).allow(null),
            grouping_key: Joi.number().required().allow(''),
            next_payee: Joi.number().required().allow(''),
            lockbox: Joi.number().required().allow(''),

        },
        payment_advice: {
            rsn_code: Joi.number().required().allow(''),
            selection_rule: Joi.number().required().allow(''),
        },
    },
    correspondence: {
        dunning_data: {
            dunn_procedure: Joi.number().required().allow(''),
            dunn_recipient: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            last_dunned_date: Joi.date().required().allow(''),
            dunning_clerk: Joi.number().required().allow(''),
            dunn_block: Joi.number().required().allow(''),
            legal_dunn_procedure: Joi.number().required().allow(''),
            dunn_level: Joi.number().required().allow(''),
            grouping_key: Joi.number().required().allow(''),
        },
        correspondences: {
            acct_clerk: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            acct_customer: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            customer_user: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            act_clk_tel_no: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            clerks_fax: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            clerks_internet: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            acct_memo: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            bank: Joi.number().required().allow(''),
            invoice: Joi.number().required().allow(''),
            decentralized: Joi.boolean().required().allow(''),
        },
        payment_notices: {
            customer_with: Joi.boolean().required().allow(''),
            customer_without: Joi.boolean().required().allow(''),
            sales: Joi.boolean().required().allow(''),
            accounting: Joi.boolean().required().allow(''),
            legal_department: Joi.boolean().required().allow(''),
        },
    },
    with_holding_tax: {
        with_tax_information: Joi.array().items(Joi.object({
            wth_t_ty: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            w_tax_c: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            w_tax: Joi.boolean().required().allow(''),
            oblig_form: Joi.date().required().allow(''),
            oblig_to: Joi.date().required().allow(''),
            w_tax_number: Joi.number().required().allow(''),
            name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        })),
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};