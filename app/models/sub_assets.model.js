const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const assetsSchema = new mongoose.Schema({
  header:{
  asset_class: { type: String, trim: true, required: true },
  company_code_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
  number_of_similar_assets: { type: Number, trim: true, required: true },
  class: { type: Number, trim: true, required: true },
  post_capitalization: { type: Boolean, trim: false},
  },
  general: {
    general_data: {
      description: { type: String, trim: true, required: true },
      asset_main_no: { type: String, trim: true, required: false},
      acct_determination: { type: Number, required: true },
      serial_number: { type: Number, trim: true, required: true },
      inventory_number: { type: Number, trim: true, required: false },
      quantity: { type: Number, trim: true, required: false },
      manage_historically: { type: Boolean, required: true },
    },
    inventory: {
      last_inventory_on: { type: Date, default: () => new Date(), required: false },
      inventory_note: { type: String, trim: true, required: false },
      include_asset_in_inventory_list: { type: Boolean, required: true },
    },  
    posting_information: {
      capitalized_on: { type: String, trim: true, required: false },
      first_acquisition_on: { type: Date, default: () => new Date(), required: false },
      acquisition_year: { type: Date, default: () => new Date(), required: false},
      deactivation_on: { type: Date, default: () => new Date(), required: false },
    },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model('sub_asset', assetsSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;