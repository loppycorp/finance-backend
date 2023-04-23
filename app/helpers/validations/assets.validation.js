const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    asset_class: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    company_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    number_of_similar_assets: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    class: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    general: {
      general_data: {
        description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        asset_main_no: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        acct_determination: Joi.number().required().max(LIMIT_DEFAULT_CHAR),
        serial_number: Joi.number().required().max(LIMIT_DEFAULT_CHAR),
        inventory_number: Joi.number().required().max(LIMIT_DEFAULT_CHAR),
        quantity: Joi.number().required().max(LIMIT_DEFAULT_CHAR),
        manage_historically: Joi.boolean().required(),
      },
      inventory: {
        last_inventory_on:Joi.date().required(),
        inventory_note: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        include_asset_in_inventory_list: Joi.boolean().required(),
      },
      posting_information: {
        capitalized_on: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        first_acquisition_on: Joi.date().required(),
        acquisition_year: Joi.date().required(),
        deactivation_on: Joi.date().required(),
      }
    },
    time_dependent: {
      interval: {
        cost_center:Joi.string().trim().required().hex().max(24),
        plant: Joi.number().required().max(LIMIT_DEFAULT_CHAR),
        location: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        room: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        shift_factor: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
      }
    },    
});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};