const Joi = require('joi');
const LIMIT_DEFAULT_CHAR = 128;
const defaultSchema = Joi.object({
    header: {
        unit_sales: Joi.number().allow(null),
        sold_to_party: Joi.number().allow(null),
        po_number: Joi.number().allow(null),
        po_date: Joi.date().allow(null),
        net_value: Joi.number().allow(null),
    },
    sales: {
        items: {
            req_delv_date: Joi.date().allow(null),
            complete_dlv: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            delivery_block: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            payment_card: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            card_verif_code: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            payment_terms: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            order_reason: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            delivery_plant: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            total_weight: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            volume: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            pricing_date: Joi.date().allow(null),
            exp_date: Joi.date().allow(null),
        }
    },
    all_items: {
        items: Joi.array().items(Joi.object({
            material: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            order_quantity: Joi.number().allow(null),
            un: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            s: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            description: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            customer_material_numb: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            itca: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            hl_itm: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            d: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            first_date: Joi.date().allow(null),
            plnt: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            batch: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        })),
    },
});

module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};
