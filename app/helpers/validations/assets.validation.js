const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header: {
    asset_class: Joi.string().trim().max(LIMIT_DEFAULT_CHAR),
    company_code: Joi.string().trim().hex().max(24),
    number_of_similar_assets: Joi.number(),
    class: Joi.number(),
  },
  general: {
    general_data: {
      description: Joi.string().trim().max(LIMIT_DEFAULT_CHAR),
      asset_main_no: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
      acct_determination: Joi.number(),
      serial_number: Joi.number(),
      inventory_number: Joi.number().allow(''),
      quantity: Joi.number().allow(''),
      manage_historically: Joi.boolean().allow(''),
    },
    inventory: {
      last_inventory_on: Joi.date().allow(''),
      inventory_note: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
      include_asset_in_inventory_list: Joi.boolean(),
    },
    posting_information: {
      capitalized_on: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
      first_acquisition_on: Joi.date().allow(''),
      acquisition_year: Joi.date().allow(''),
      deactivation_on: Joi.date().allow(''),
    }
  },
  time_dependent: {
    interval: {
      cost_center: Joi.string().trim().hex().max(24),
      plant: Joi.number(),
      location: Joi.string().trim().max(LIMIT_DEFAULT_CHAR),
      room: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
      shift_factor: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow(''),
    }
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema
};