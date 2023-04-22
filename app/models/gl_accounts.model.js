const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const gl_accountSchema = new mongoose.Schema({
    gl_account_id:{ type: Number, trim: true, required: true}, 
    company_code_id: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'company_codes' },
    type_description: {
        chart_of_accounts: {
             account_group_id:{ type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'account_groups' },
             statement_account: { type: Boolean, required: true},
             balance_sheet_account: { type: Boolean, required: true},
        },
        description:{
            short_text:{ type: String, trim: true, required: true},
            long_text:{ type: String, trim: true, required: true},
        },
        consoldation_data_in_chart_of_accounts:{
            trading_partner:{ type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'traiding_partners' },
        }
    },
    control_data:{
        account_control_in_company_code:{
            account_currency:{ type: String, trim: true, required: true},
            local_crcy:{ type: Boolean, required: true},
            exchange_rate:{ type: String, trim: true, required: true},
            valuation_group:{ type: String, trim: true, required: true},
            tax_category:{ type: String, trim: true, required: true},
            posting_tax_allowed:{ type: Boolean,required: true},
        },
        account_management_in_company_code:{
            item_mgmt:{ type: Boolean,required: true},
            line_item:{ type: Boolean,required: true},
            sort_key:{ type: Number, trim: true, required: true},
        }
    },
    create_bank_interest:{
        field_status_group:{ type: String, trim: true, required: true},
        post_automatically:{ type: Boolean, required: true},
    },
    status:  { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date,  default: () => new Date(), required: true }
 
});

module.exports = mongoose.model('gl_account', gl_accountSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;