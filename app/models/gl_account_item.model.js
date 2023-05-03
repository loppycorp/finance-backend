const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const defaultSchema = new mongoose.Schema({
  gl_account_header_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "gl_account_headers", },
  line_item: {
    pstky: { type: String, trim: true, required: true },
    gl_account_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "gl_accounts" },
    sgl_ind: { type: String, trim: true, required: false },
    t_type: { type: String, trim: true, required: false },
    new_code: { type: Number, trim: true, required: false },
  },
  gl_account_document: {
    item: {
      amount: { type: Number, trim: true, required: true },
      business_place: { type: String, trim: true, required: true },
      cost_center_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "cost_centers",
      },
      wbs_element: { type: String, trim: true, required: true },
      network: { type: String, trim: true, required: true },
      order: { type: String, trim: true, required: true },
      profit_segment: { type: String, trim: true, required: true },
      calculate_tax: { type: String, trim: true, required: true },
      sales_order: { type: String, trim: true, required: true },
      purchasing_doc: { type: String, trim: true, required: true },
      assignment: { type: String, trim: true, required: true },
      text: { type: String, trim: true, required: true },
      quantity: { type: Number, trim: true, required: true },
    },
  },
  status: { type: String, default: STATUS_ACTIVE, required: true },
  date_created: { type: Date, default: () => new Date(), required: true },
  date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("gl_account_posting", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
