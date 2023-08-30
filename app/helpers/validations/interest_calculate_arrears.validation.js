const Joi = require('joi');


const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        vendor_account: Joi.string().trim().hex().length(24).allow('', null),
        vendor_account_to: Joi.string().trim().hex().length(24).allow('', null),
        company_code: Joi.string().trim().hex().length(24).allow('', null),
        company_code_to: Joi.string().trim().hex().length(24).allow('', null),
    },
    window_1: {
        further_selections: {
            calculation_period: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            calculation_period_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            bill_of_exchange_pmnt_possible: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            bill_exh_pmnt_document_typ: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            bill_exh_pmnt_document_typ_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            interest_indicator: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            interest_indicator_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            reconcilation_account: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            reconcilation_account_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            sp_gl_ind_to_be_selected: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            sp_gl_ind_to_be_selected_to: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        }
    },
    window_2: {
        output_control: {
            create_form: Joi.boolean().allow(null),
            form_name: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            print_form: Joi.boolean().allow(null),
            form_printer_batch: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            date_of_issue: Joi.date().allow(null),
            number_of_test_printouts: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
            additional_line_for_line_items: Joi.boolean().allow(null),
            display_interest_rate_changes: Joi.boolean().allow(null),
            print_interest_rate_table: Joi.boolean().allow(null),
            leap_year: Joi.boolean().allow(null),
            business_area_allocation: Joi.boolean().allow(null),
            print_account_overview: Joi.boolean().allow(null),
            acct_overview_printer_batch: Joi.string().trim().max(LIMIT_DEFAULT_CHAR).allow('', null),
        }
    },
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};