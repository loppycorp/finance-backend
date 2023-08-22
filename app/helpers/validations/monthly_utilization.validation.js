const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        company_code: Joi.string().trim().hex().length(24).allow('', null),
        plant: Joi.string().trim().hex().length(24).allow('', null),
        eexcise_group: Joi.number().allow(null),
        sub_transaction_type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        adc_sub_transation_type: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        period: Joi.date().allow(null),
        to: Joi.date().allow(null),
        excise_invoice: Joi.date().allow(null),
        to: Joi.date().allow(null),
        business_area: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        fortnightly_pymt_posting_date: Joi.date().allow(null),
        pay_cenvat_from_ser_tax_cr: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        pay_ser_tax_from_cenvat_cr: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        service_tax_credit_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        secess_on_ser_tax_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        service_tax_payable_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        ecs_on_ser_payable_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        secess_on_ser_payable_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};