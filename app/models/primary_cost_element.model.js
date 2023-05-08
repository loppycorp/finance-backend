const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const primaryCstElmtSchema = new mongoose.Schema({
  cost_element: { type: Number, required: true },
  controlling_area_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "controlling_areas",
  },
  valid_from: { type: Date, required: true },
  valid_to: { type: Date, required: true },
  basic_data: {
    names: {
      name: { type: String, trim: true, required: true },
      description: { type: String, trim: true, required: true },
    },

    basic_data: {
      cost_elem_ctgry: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "cost_elem_categries",
      },
      attribute: { type: String, trim: true, required: false },
      func_area: { type: String, trim: true, required: false },
    },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("primary_cost_element", primaryCstElmtSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
