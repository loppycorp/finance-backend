const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    header: {
        vendor_code: Joi.number().integer(),
        company_code: Joi.string().trim().required().hex().length(24),
    },
    account_management: {
        accounting_information: {
            recon_account: Joi.number().integer(),
            head_office: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            authorization: Joi.number().integer().allow(''),
            minority_indic: Joi.number().integer().allow(''),
            sort_key: Joi.number().integer().allow(''),
            cash_mgmnt_group: Joi.string().trim().hex().length(24).allow('', null),
            release_group: Joi.string().trim().hex().length(24).allow('', null),
            certification_date: Joi.date().required().allow(''),

        },
        interest_calculation: {
            interest_indic: Joi.number().integer().allow(''),
            interest_freq: Joi.number().integer().allow(''),
            lastkey_date: Joi.date().required().allow(''),
            interest_run: Joi.date().required().allow(''),
        },
        reference_data: {
            prev_account_no: Joi.number().integer().allow(''),
            personnel_number: Joi.number().integer().allow(''),
        },
    },
    payment_transactions: {
        payment_data: {
            payment_terms: Joi.number().integer().allow(''),
            chk_cashing_time: Joi.date().required().allow(''),
            tolerance_group: Joi.string().trim().required().hex().length(24).allow(null),
            chk_double_inv: Joi.boolean().required().allow(''),
        },
        auto_payment_transactions: {
            payment_methods: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            alternate_payee: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            individual_pmnt: Joi.boolean().required().allow(''),
            exch_limit: Joi.number().integer().allow(''),
            pmnt_adv: Joi.boolean().required().allow(''),
            payment_block: Joi.number().integer().allow(''),
            house_bank: Joi.string().trim().required().hex().length(24).allow('', null),
            grouping_key: Joi.number().integer().allow(''),
        },
        invoice_verification: {
<<<<<<< HEAD
            tolerance_group: Joi.string().trim().required().hex().length(24).allow(null),
=======
            tolerance_group: Joi.string().trim().required().hex().length(24).allow('', null),
>>>>>>> origin/main
        },
    },
    correspondence: {
        dunning_data: {
            dunn_procedure: Joi.number().integer().allow(''),
            dunn_recipient: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            last_dunned_date: Joi.date().required().allow(''),
            dunning_clerk: Joi.number().integer().allow(''),
            dunn_block: Joi.number().integer().allow(''),
            legal_dunn_procedure: Joi.number().integer().allow(''),
            dunn_level: Joi.number().integer().allow(''),
            grouping_key: Joi.number().integer().allow(''),
        },
        correspondences: {
            local_process: Joi.boolean().required().allow(''),
            acct_clerk: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            acct_vendor: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            clerk_vendor: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            act_clk_tel_no: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            clerks_fax: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            clerks_internet: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            acct_memo: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },
    with_tax_information: {
        with_tax_information: Joi.array().items(Joi.object({
            wth_t_ty: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            w_tax_c: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            liable: Joi.boolean(),
            rec_ty: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            w_tax_id: Joi.number().integer().allow(''),
            exemption_number: Joi.number().integer().allow(''),
            exem: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            exmpt_r: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            exempt_form: Joi.date().required().allow(''),
            exempt_to: Joi.date().required().allow(''),
            description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        }))
    },
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};