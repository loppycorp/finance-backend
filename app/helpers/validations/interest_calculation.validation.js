const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        vendor: Joi.string().trim().hex().length(24).allow('', null),
        company_code: Joi.string().trim().hex().length(24).allow('', null),
    },
    window_1: {
        accounting_information: {
            recon_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            head_office: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            authorization: Joi.string().trim().hex().length(24).allow('', null),
            minority_indic: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            sort_key: Joi.string().trim().hex().length(24).allow('', null),
            subsidy_indic: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            cash_mgmnt_group: Joi.string().trim().hex().length(24).allow('', null),
            release_group: Joi.string().trim().hex().length(24).allow('', null),
            certificatn_date: Joi.date().allow(null),
        },
    },
    window_2: {
        interest_calculation: {
            interest_indic: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            interest_freq: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            last_key_date: Joi.date().allow(null),
            last_interest_run: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        },
    },
    window_3: {
        reference_data: {
            prev_acc_no: Joi.number().integer().allow(null, ''),
            personnel_number: Joi.number().integer().allow(null, ''),
        },
    },
    window_4: {
        default_data_for_tax_reports: {
            activity_code: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            distr_type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        },
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};