const Joi = require('joi');
const ProfitCenter = require('../../models/profit_center.model');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;
const LIMIT_DEFAULT_CODE = 32;

const defaultSchema = Joi.object({
    header: {
        controlling_area: Joi.string().trim().required().hex().max(24),
    },
    basic_data: {
        description: {
            profit_center_code: Joi.number().required(),
            analysis_period: {
                from: Joi.date().required(),
                to: Joi.date().required(),
            },
            name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            long_text: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR_LONG),
            status: Joi.string().trim().required().valid(
                ProfitCenter.STATUS_PROFIT_CTR_INACTIVE_CREATE,
                ProfitCenter.STATUS_PROFIT_CTR_INACTIVE_UPDATE,
                ProfitCenter.STATUS_PROFIT_CTR_INACTIVE_DELETE,
                ProfitCenter.STATUS_PROFIT_CTR_ACTIVE_CREATE,
                ProfitCenter.STATUS_PROFIT_CTR_ACTIVE_UPDATE,
                ProfitCenter.STATUS_PROFIT_CTR_ACTIVE_DELETE
            )
        },
        basic_data: {
            user_responsible: Joi.string().trim().required().hex().length(24).allow(null),
            person_responsible: Joi.string().trim().required().allow(''),
            department: Joi.string().trim().required().hex().length(24).allow(null),
            profit_ctr_group: Joi.string().trim().required().hex().length(24),
            segment: Joi.string().trim().required().hex().length(24)
        }
    }
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};