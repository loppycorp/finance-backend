const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const vendorCompanyCodeData = new mongoose.Schema({
    header: {
        vendor_code: { type: Number, trim: true, required: false },
        company_code: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'companies' },
    },
    account_management: {
        accounting_information: {
            recon_account: { type: Number, trim: true, required: true },
            head_office: { type: String, trim: true, required: true },
            authorization: { type: Number, trim: true, required: false },
            minority_indic: { type: Number, trim: true, required: false },
            sort_key: { type: Number, trim: true, required: true },
            cash_mgmnt_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'cash_mgmnt_groups' },
            release_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'release_groups' },
            certification_date: { type: Date, required: false },

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
        },
    },
    payment_transactions: {
        payment_data: {
            payment_terms: { type: Number, trim: true, required: false },
            chk_cashing_time: { type: Date, required: false },
            tolerance_groups: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'tolerance_groups' },
            chk_double_inv: { type: Boolean, required: false },
        },
        auto_payment_transactions: {
            payment_methods: { type: String, trim: true, required: false },
            alternate_payee: { type: String, trim: true, required: false },
            individual_pmnt: { type: Boolean, required: false },
            exch_limit: { type: Number, trim: true, required: false },
            pmnt_adv: { type: Boolean, required: false },
            payment_block: { type: Number, trim: true, required: false },
            house_bank: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'house_banks' },
            grouping_key: { type: Number, trim: true, required: false },
        },
        invoice_verification: {
            tolerance_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'tolerance_groups' },
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
            local_process: { type: Boolean, required: false },
            acct_clerk: { type: String, trim: true, required: false },
            acct_vendor: { type: String, trim: true, required: false },
            clerk_vendor: { type: String, trim: true, required: false },
            act_clk_tel_no: { type: String, trim: true, required: false },
            clerks_fax: { type: String, trim: true, required: false },
            clerks_internet: { type: String, trim: true, required: false },
            acct_memo: { type: String, trim: true, required: false },
        },
    },
    with_tax_information: {
        with_tax_information: [{
            wth_t_ty: { type: String, required: false, trim: true },
            w_tax_c: { type: String, required: false, trim: true },
            liable: { type: Boolean, required: false },
            rec_ty: { type: String, required: false, trim: true },
            w_tax_id: { type: Number, trim: true, required: false },
            exemption_number: { type: Number, trim: true, required: false },
            exem: { type: String, required: false, trim: true },
            exmpt_r: { type: String, required: false, trim: true },
            exempt_form: { type: Date, required: false },
            exempt_to: { type: Date, required: false },
            description: { type: String, required: false, trim: true },
        }],
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true }
});

module.exports = mongoose.model('vendor_company_code_data', vendorCompanyCodeData);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

