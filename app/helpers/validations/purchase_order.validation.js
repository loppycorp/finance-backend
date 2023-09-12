const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        vendor: Joi.string().trim().hex().max(24).allow('', null),
        doc_date: Joi.date().allow('', null),
    },
    window: {
        org_data: {
            purchasing_org: Joi.string().trim().hex().max(24).allow('', null),
            purch_group: Joi.string().trim().hex().max(24).allow('', null),
            company_code: Joi.string().trim().hex().max(24).allow('', null),
        },
        additional_data: {
            validity_start: Joi.date().allow('', null),
            validity_end: Joi.date().allow('', null),
            collective_no: Joi.number().allow('', null),
        },
        account_assignments: {
            acc_ass_cat: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            distribution: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            co_code: Joi.string().trim().hex().max(24).allow('', null),
            unloading_point: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            recipient: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            gl_account: Joi.string().trim().hex().max(24).allow('', null),
            co_area: Joi.string().trim().hex().max(24).allow('', null),
            cost_center: Joi.string().trim().hex().max(24).allow('', null),
            order: Joi.string().trim().hex().max(24).allow('', null),
            network: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        },
        invoice: {
            tax_code: Joi.string().trim().hex().max(24).allow('', null),
        },
    },
    condition: {
        condition: {
            qty: Joi.number().allow('', null),
            net: Joi.number().allow('', null),
            currency: Joi.string().trim().hex().max(24).allow('', null),

        },
        items: Joi.array().items(Joi.object({
            cnty: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            name: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            amount: Joi.number().allow('', null),
            per: Joi.number().allow('', null),
            condition_value: Joi.number().allow('', null),
            curr: Joi.string().trim().hex().max(24).allow('', null),
            status: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            numc: Joi.number().allow('', null),
            oun: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            cdcur: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        })),
    },
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};
