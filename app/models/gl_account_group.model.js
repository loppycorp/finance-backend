const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const accountGroupSchema = new mongoose.Schema({
  charts_of_account: { type: String, trim: true, required: true },
  account_group: { type: Number, required: true },
  name: { type: String, trim: true, required: true },
  from_account: { type: Number, required: true },
  to_account: { type: Number, required: true },

  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});



module.exports = mongoose.model("account_group", accountGroupSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
