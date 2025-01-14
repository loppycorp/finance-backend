const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const customerCompanyCodeData = new mongoose.Schema({
    header: {
        customer_code: { type: Number, trim: true, required: true },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
    },
    account_management: {
        accounting_information: {
            recon_account: { type: Number, trim: true, required: true },
            head_office: { type: String, trim: true, required: true },
            authorization: { type: Number, trim: true, required: false },
            sort_key: { type: Number, trim: true, required: false },
            cash_mgmnt_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'cash_mgmnt_groups' },
            value_adjustment: { type: Number, trim: true, required: false },

        },
        interest_calculation: {
            interest_indic: { type: Number, trim: true, required: false },
            interest_freq: { type: Number, trim: true, required: false },
            lastkey_date: { type: Date, required: false },
            interest_run: { type: Date, required: false },
        },
        reference_data: {
            prev_account_no: { type: Number, trim: true, required: false },
            personnel_number: { type: Number, trim: true, required: false },
            buying_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'buying_groups' },

        },
    },
    payment_transactions: {
        payment_data: {
            payment_terms: { type: Number, trim: true, required: false },
            charges_payment_terms: { type: Number, trim: true, required: false },
            check_paid_time: { type: Date, required: false },
            tolerance_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'tolerance_groups' },
            leave: { type: Number, trim: true, required: false },
            pleding_ind: { type: Number, trim: true, required: false },
            payment_history: { type: Boolean, required: false },
        },
        auto_payment_transactions: {
            payment_methods: { type: String, trim: true, required: false },
            alternate_payee: { type: String, trim: true, required: false },
            exch_limit: { type: Number, trim: true, required: false },
            single_payment: { type: Boolean, required: false },
            pmnt_adv: { type: Boolean, required: false },
            payment_block: { type: Number, trim: true, required: false },
            house_bank: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'house_banks' },
            grouping_key: { type: Number, trim: true, required: false },
            next_payee: { type: Number, trim: true, required: false },
            lockbox: { type: Number, trim: true, required: false },

        },
        payment_advice: {
            rsn_code: { type: Number, trim: true, required: false },
            selection_rule: { type: Number, trim: true, required: false },
        },
    },
    correspondence: {
        dunning_data: {
            dunn_procedure: { type: Number, trim: true, required: false },
            dunn_recipient: { type: String, trim: true, required: false },
            last_dunned_date: { type: Date, required: false },
            dunning_clerk: { type: Number, trim: true, required: false },
            dunn_block: { type: Number, trim: true, required: false },
            legal_dunn_procedure: { type: Number, trim: true, required: false },
            dunn_level: { type: Number, trim: true, required: false },
            grouping_key: { type: Number, trim: true, required: false },
        },
        correspondences: {
            acct_clerk: { type: String, trim: true, required: false },
            acct_customer: { type: String, trim: true, required: false },
            customer_user: { type: String, trim: true, required: false },
            act_clk_tel_no: { type: String, trim: true, required: false },
            clerks_fax: { type: String, trim: true, required: false },
            clerks_internet: { type: String, trim: true, required: false },
            acct_memo: { type: String, trim: true, required: false },
            bank: { type: Number, trim: true, required: false },
            invoice: { type: Number, trim: true, required: false },
            decentralized: { type: Boolean, required: false },
        },
        payment_notices: {
            customer_with: { type: Boolean, required: false },
            customer_without: { type: Boolean, required: false },
            sales: { type: Boolean, required: false },
            accounting: { type: Boolean, required: false },
            legal_department: { type: Boolean, required: false },
        },
    },
    with_holding_tax: {
        with_tax_information: [{
            wth_t_ty: { type: String, required: false, trim: true },
            w_tax_c: { type: String, required: false, trim: true },
            w_tax: { type: Boolean, required: false },
            oblig_form: { type: Date, required: false },
            oblig_to: { type: Date, required: false },
            w_tax_number: { type: Number, trim: true, required: false },
            name: { type: String, required: false, trim: true },
        }],
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('customer_company_code_data', customerCompanyCodeData);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

