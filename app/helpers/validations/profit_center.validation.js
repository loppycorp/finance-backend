const Joi = require('joi');
const ProfitCenter = require('../../models/profit_center.model');

const LIMIT_DEFAULT_CHAR = 128;
const LIMIT_DEFAULT_CHAR_LONG = 225;

const defaultSchema = Joi.object({
    controlling_area_id: Joi.string().trim().required().hex().max(24), 
    description: {
        profit_center_code: Joi.string().trim().required(),
        analysis_period: {
            from: Joi.date().required(),
            to: Joi.date().required(),
        },
        name:  Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        long_text:  Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR_LONG),
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
        user_responsible_id: Joi.string().trim().required().hex().length(24),
        person_responsible_id: Joi.string().trim().required().hex().length(24),
        department_id: Joi.string().trim().required().hex().length(24),
        profit_ctr_group_id: Joi.string().trim().required().hex().length(24),
        segment_id: Joi.string().trim().required().hex().length(24)
    }
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};