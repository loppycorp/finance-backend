const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
  header:{
  asset_class: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
  company_code_id: Joi.string().trim().required().hex().max(24),
  number_of_similar_assets: Joi.number().required(),
  class: Joi.number().required(),
  post_capitalization: Joi.boolean().required().allow(''),
},
  general: {
    general_data: {
      description: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
      asset_main_no: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
      acct_determination: Joi.number().required(),
      serial_number: Joi.number().required(),
      inventory_number: Joi.number().required().allow(''),
      quantity: Joi.number().required().allow(''),
      manage_historically: Joi.boolean().required().allow(''),
    },
    inventory: {
      last_inventory_on: Joi.date().required().allow(''),
      inventory_note: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
      include_asset_in_inventory_list: Joi.boolean().required(),
    },
    posting_information: {
      capitalized_on: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
      first_acquisition_on: Joi.date().required().allow(''),
      acquisition_year: Joi.date().required().allow(''),
      deactivation_on: Joi.date().required().allow(''),
    }
  },
});
module.exports = {
  createSchema: defaultSchema,
  updateSchema: defaultSchema
};