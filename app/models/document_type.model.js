const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
  description: { type: String, trim: true, required: true },
  document_type_code: { type: String, trim: true, required: true },
  reverse_type: { type: String, trim: true, required: false },
  account_types: { type: String, trim: true, required: false },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("document_type", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
