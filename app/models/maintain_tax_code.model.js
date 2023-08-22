const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        country_key: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "countries",
        },
        tax_code: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "tax_codes",
        },
        procedure: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "procedures",
        },
        tax_type: {
            type: mongoose.SchemaTypes.ObjectId,
            required: false,
            ref: "tax_types",
        },
    },
    percentage_rates: {
        item: [{
            tax_type: { type: String, trim: true, required: false },
            acct_key: { type: String, trim: true, required: false },
            tax_percent_rate: { type: String, trim: true, required: false },
            level: { type: Number, required: false },
            from_lvl: { type: Number, required: false },
            cont_type: { type: Number, required: false },
        }],
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("maintain_tax_code", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
