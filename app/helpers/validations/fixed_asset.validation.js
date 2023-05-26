const Joi = require('joi');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    header: {
        material: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        industry_sector: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        material_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
        change_number: Joi.number().required().allow(''),
        plant: Joi.string().trim().required().hex().length(24).allow(null),
        stor_location: Joi.string().trim().required().hex().length(24).allow(null),
    },
    basic_data1: {
        general_data: {
            base_unit_of_measure: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            old_material_number: Joi.number().required().allow(''),
            division: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            product_allocation: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            x_plant_matl_status: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            assign_effet_vals: Joi.boolean().required().allow(''),
            material_group: Joi.string().trim().required().hex().length(24).allow(null),
            ext_matl_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            lab_office: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            valid_from: Joi.date().required().allow(''),
            gen_item_cat_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        material_authorization_group: {
            authorization_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        dimensions_eans: {
            gross_weight: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            net_weight: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            volume: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            size_dimensions: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            ean_upc: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            weight_unit: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            volume_unit: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            ean_category: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        packaging_materil_data: {
            matl_grp_pack_matls: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },

    purchasing: {
        general_data: {
            base_unit_of_measure: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            purchasing_group: Joi.string().trim().required().hex().length(24).allow(null),
            plant_sp_matl_status: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            tax_ind_f_material: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            material_freight_grp: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            batch_management: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            order_unit: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            material_group: Joi.string().trim().required().hex().length(24).allow(null),
            valid_from: Joi.date().required().allow(''),
            qual_f_free_goods_dis: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            autom_po: Joi.boolean().required().allow(''),
            var_oun: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },

        purchasing_value: {
            purchasing_value_key: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            first_rem_exped: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            second_reminder_exped: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            third_reminder_exped: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            std_value_deliv_date_var: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            shipping_instr: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            underdel_tolerance: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            overdeliv_tolerance: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            min_del_qty_in_percent: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            unltd_overdelivery: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            acknowledgement_reqd: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        other_data_manufacturer_data: {
            gr_processing_time: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            quota_arr_usage: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            post_to_insp_stock: Joi.boolean().required().allow(''),
            source_list: Joi.boolean().required().allow(''),
            critical_part: Joi.boolean().required().allow(''),
            sched_indicator: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        }
    },


    foreign_trade_import: {
        cas_number: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        prodcom_no: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        control_code: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        origin_eu_market_organization_preferences: {
            country_of_origin: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            cap_product_list_no: Joi.number().required().allow(''),
            cap_prod_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            preference_status: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            vendor_decl_status: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            region_of_origin: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        legal_control: {
            exemption_certificate: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            iss_date_of_ex_cert: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            military_goods: Joi.boolean().required().allow(''),
            exemption_cert_no: Joi.number().required().allow(''),
        },
        excise_data: {
            chapter_id: Joi.number().required().allow(''),
            no_grs_per_ei: Joi.number().required().allow(''),
            valid_from: Joi.date().required().allow(''),
            currency_key: Joi.string().trim().required().hex().length(24).allow(null),
            net_dealer_price: Joi.number().required().allow(''),
            subcontractors: Joi.boolean().required().allow(''),
            output_matl: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            assessable_val: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            material_type: Joi.string().trim().required().hex().length(24).allow(null),
        },
    },

    plant_data_stor_1: {
        general_data: {
            base_unit_of_measure: Joi.string().trim().required().hex().length(24).allow(null),
            storage_bin: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            temp_conditions: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            container_reqmts: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            cc_phys_inv_ind: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            label_type: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            batch_management: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            cc_fixed: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            lab_form: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            unit_of_issue: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            picking_area: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            storage_conditions: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            haz_material_number: Joi.number().required().allow(''),
            number_of_gr_slips: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            appr_batch_rec_req: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        shelf_life_data: {
            max_storage_period: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            min_rem_shelf_life: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            period_ind_for_sled: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            storage_percentage: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            time_unit: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            total_shelf_life: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            rounding_rule_sled: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },


    plant_data_stor_2: {
        weight_volume: {
            gross_weight: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            net_weight: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            volume: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            size_dimensions: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            weight_unit: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            volume_unit: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        general_plant_parameters: {
            neg_stocks_in_plant: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            serial_no_profile: Joi.number().required().allow(''),
            profit_center: Joi.string().trim().required().hex().length(24).allow(null),
            serlevel: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            log_handling_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            distr_profile: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            stock_detem_group: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
    },

    accounting_1: {
        general_data: {
            base_unit_of_measure: Joi.string().trim().required().hex().length(24).allow(null),
            currency: Joi.string().trim().required().hex().length(24).allow(null),
            division: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            valuation_category: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            current_period: Joi.date().required().allow(''),
            price_determ: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
        },
        current_valuation: {
            valuation_class: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
            vc_sales_order_stk: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            price_control: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            moving_price: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            total_stock: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            future_price: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            proj_stk_val_class: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            price_unit: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            standard_price: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            total_value: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR).allow(''),
            valuated_un: Joi.boolean().required().allow(''),
            valid_from: Joi.date().required().allow(''),
        }
    },

});
module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema
};