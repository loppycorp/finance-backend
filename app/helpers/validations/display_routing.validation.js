const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        material: Joi.string().trim().hex().max(24).allow('', null),
        plant: Joi.string().trim().hex().max(24).allow('', null),
        sales_document: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        sales_document_item: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        wbs_elemet: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        sequence: Joi.number().allow('', null),
    },
    window: {
        validity: {
            change_number: Joi.number().allow('', null),
            key_date: Joi.date().allow('', null),
            revision_level: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        },
        additional_criteria_for_list_selection: {
            plant: Joi.string().trim().hex().max(24).allow('', null),
            group_counter: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            task_list_status: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            planner_group: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        },
    },
    items: {
        operation_overview: Joi.array().items(Joi.object({
            op: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            sop: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            work_ce: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            plnt: Joi.string().trim().hex().max(24).allow('', null),
            co: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            standard: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            description: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            lo: Joi.boolean().allow('', null),
            p: Joi.boolean().allow('', null),
            ci: Joi.boolean().allow('', null),
            o: Joi.boolean().allow('', null),
            pe: Joi.boolean().allow('', null),
            c: Joi.boolean().allow('', null),
            su: Joi.boolean().allow('', null),
            bas: Joi.boolean().allow('', null),
        })),
    },
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};
