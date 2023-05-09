const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const CALCULATE_TAX_Y = 'YES';
const CALCULATE_TAX_N = 'YES';

const defaultSchema = new mongoose.Schema({
    gl_account_document_header: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'gl_account_document_headers' },

    company: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
	gl_account: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'gl_accounts' },

	amount: { type: Number, required: true },
    tax_code: { type: String, required: false },
	calculate_tax: { type: String, default: CALCULATE_TAX_N, required: false },
    
	bussiness_place: { type: String, required: false },
	
	cost_center: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'cost_centers' },
	order: { type: String, required: false },
	
	wbs_element: { type: String, required: false },
	profit_segment: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'segments' },
	network: { type: String, required: false },
	
	sales_order: { type: String, required: false },
	
	purchasing_doc: { type: String, required: false },
	quantity: { type: Number, required: false },
	
	assignment: { type: String, required: false },
	text: { type: String, required: false },
	
	ptsky_type: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'posting_key' },

    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("gl_account_document_item", defaultSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

module.exports.CALCULATE_TAX_N = CALCULATE_TAX_N;
module.exports.CALCULATE_TAX_Y = CALCULATE_TAX_Y;
