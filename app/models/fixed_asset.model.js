const mongoose = require("mongoose");

const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";

const DefaulSchema = new mongoose.Schema({
    header: {
        material: { type: String, trim: true, required: true },
        industry_sector: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'industry_sectors' },
        material_type: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'material_types' },
        change_number: { type: Number, trim: true, required: false },
        plant: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'plants' },
        stor_location: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'stor_locations' },
    },
    basic_data1: {
        general_data: {
            base_unit_of_measure: { type: String, trim: true, required: false },
            old_material_number: { type: Number, trim: true, required: false },
            division: { type: String, trim: true, required: false },
            product_allocation: { type: String, trim: true, required: false },
            x_plant_matl_status: { type: String, trim: true, required: false },
            assign_effet_vals: { type: Boolean, required: false },
            material_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_groups' },
            ext_matl_group: { type: String, trim: true, required: false },
            lab_office: { type: String, trim: true, required: false },
            valid_from: { type: Date, default: () => new Date(), required: false },
            gen_item_cat_group: { type: String, trim: true, required: false },
        },
        material_authorization_group: {
            authorization_group: { type: String, trim: true, required: false },
        },
        dimensions_eans: {
            gross_weight: { type: String, trim: true, required: false },
            net_weight: { type: String, trim: true, required: false },
            volume: { type: String, trim: true, required: false },
            size_dimensions: { type: String, trim: true, required: false },
            ean_upc: { type: String, trim: true, required: false },
            weight_unit: { type: String, trim: true, required: false },
            volume_unit: { type: String, trim: true, required: false },
            ean_category: { type: String, trim: true, required: false },
        },
        packaging_materil_data: {
            matl_grp_pack_matls: { type: String, trim: true, required: false },
        },
    },

    purchasing: {
        general_data: {
            base_unit_of_measure: { type: String, trim: true, required: false },
            purchasing_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'purchasing_groups' },
            plant_sp_matl_status: { type: String, trim: true, required: false },
            tax_ind_f_material: { type: String, trim: true, required: false },
            material_freight_grp: { type: String, trim: true, required: false },
            batch_management: { type: String, trim: true, required: false },
            order_unit: { type: String, trim: true, required: false },
            material_group: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_groups' },
            valid_from: { type: Date, default: () => new Date(), required: false },
            qual_f_free_goods_dis: { type: String, trim: true, required: false },
            autom_po: { type: Boolean, required: false },
            var_oun: { type: String, trim: true, required: false },
        },

        purchasing_value: {
            purchasing_value_key: { type: String, trim: true, required: false },
            first_rem_exped: { type: String, trim: true, required: false },
            second_reminder_exped: { type: String, trim: true, required: false },
            third_reminder_exped: { type: String, trim: true, required: false },
            std_value_deliv_date_var: { type: String, trim: true, required: false },
            shipping_instr: { type: String, trim: true, required: false },
            underdel_tolerance: { type: String, trim: true, required: false },
            overdeliv_tolerance: { type: String, trim: true, required: false },
            min_del_qty_in_percent: { type: String, trim: true, required: false },
            unltd_overdelivery: { type: String, trim: true, required: false },
            acknowledgement_reqd: { type: String, trim: true, required: false },
        },
        other_data_manufacturer_data: {
            gr_processing_time: { type: String, trim: true, required: false },
            quota_arr_usage: { type: String, trim: true, required: false },
            post_to_insp_stock: { type: Boolean, required: false },
            source_list: { type: Boolean, required: false },
            critical_part: { type: Boolean, required: false },
            sched_indicator: { type: String, trim: true, required: false },
        }
    },


    foreign_trade_import: {
        header: {
            cas_Number: { type: String, trim: true, required: false },
            prodcom_no: { type: String, trim: true, required: false },
            control_code: { type: String, trim: true, required: false }
        },
        origin_eu_market_organization_preferences: {
            country_of_origin: { type: String, trim: true, required: false },
            cap_product_list_no: { type: Number, trim: true, required: false },
            cap_prod_group: { type: String, trim: true, required: false },
            preference_status: { type: String, trim: true, required: false },
            vendor_decl_status: { type: String, trim: true, required: false },
            region_of_origin: { type: String, trim: true, required: false },
        },
        legal_control: {
            exemption_certificate: { type: String, trim: true, required: false },
            iss_date_of_ex_cert: { type: String, trim: true, required: false },
            military_goods: { type: Boolean, required: false },
            exemption_cert_no: { type: Number, trim: true, required: false },
        },
        excise_data: {
            chapter_id: { type: Number, trim: true, required: false },
            no_grs_per_ei: { type: Number, trim: true, required: false },
            valid_from: { type: Date, default: () => new Date(), required: false },
            currency_key: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'currencies' },
            net_dealer_price: { type: Number, trim: true, required: false },
            subcontractors: { type: Boolean, trim: true, required: false },
            output_matl: { type: String, trim: true, required: false },
            assessable_val: { type: String, trim: true, required: false },
            material_type: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'material_types' },
        },
    },

    plant_data_stor_1: {
        general_data: {
            base_unit_of_measure: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'meatures' },
            storage_bin: { type: String, trim: true, required: false },
            temp_conditions: { type: String, trim: true, required: false },
            container_reqmts: { type: String, trim: true, required: false },
            cc_phys_inv_ind: { type: String, trim: true, required: false },
            label_type: { type: String, trim: true, required: false },
            batch_management: { type: String, trim: true, required: false },
            cc_fixed: { type: String, trim: true, required: false },
            lab_form: { type: String, trim: true, required: false },
            unit_of_issue: { type: String, trim: true, required: false },
            picking_area: { type: String, trim: true, required: false },
            storage_conditions: { type: String, trim: true, required: false },
            haz_material_number: { type: Number, trim: true, required: false },
            number_of_gr_slips: { type: String, trim: true, required: false },
            appr_batch_rec_req: { type: String, trim: true, required: false },
        },
        shelf_life_data: {
            max_storage_period: { type: String, trim: true, required: false },
            min_rem_shelf_life: { type: String, trim: true, required: false },
            period_ind_for_sled: { type: String, trim: true, required: false },
            storage_percentage: { type: String, trim: true, required: false },
            time_unit: { type: String, trim: true, required: false },
            total_shelf_life: { type: String, trim: true, required: false },
            rounding_rule_sled: { type: String, trim: true, required: false },
        },
    },


    plant_data_stor_2: {
        weight_volume: {
            gross_weight: { type: String, trim: true, required: false },
            net_weight: { type: String, trim: true, required: false },
            volume: { type: String, trim: true, required: false },
            size_dimensions: { type: String, trim: true, required: false },
            weight_unit: { type: String, trim: true, required: false },
            volume_unit: { type: String, trim: true, required: false },
        },
        general_plant_parameters: {
            neg_stocks_in_plant: { type: String, trim: true, required: false },
            serial_no_profile: { type: Number, trim: true, required: false },
            profit_center: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'profit_centers' },
            serlevel: { type: String, trim: true, required: false },
            log_handling_group: { type: String, trim: true, required: false },
            distr_profile: { type: String, trim: true, required: false },
            stock_detem_group: { type: String, trim: true, required: false },
        }
    },
    accounting_1: {
        general_data: {
            base_unit_of_measure: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'meatures' },
            currency: { type: mongoose.SchemaTypes.ObjectId, required: false, ref: 'currencies' },
            division: { type: String, trim: true, required: false },
            valuation_category: { type: String, trim: true, required: false },
            current_period: { type: Date, default: () => new Date(), required: false },
            price_determ: { type: String, trim: true, required: false },
        },
        current_valuation: {
            valuation_class: { type: String, trim: true, required: false },
            vc_sales_order_stk: { type: String, trim: true, required: false },
            price_control: { type: String, trim: true, required: false },
            moving_price: { type: String, trim: true, required: false },
            total_stock: { type: String, trim: true, required: false },
            future_price: { type: String, trim: true, required: false },
            proj_stk_val_class: { type: String, trim: true, required: false },
            price_unit: { type: String, trim: true, required: false },
            standard_price: { type: String, trim: true, required: false },
            total_value: { type: String, trim: true, required: false },
            valuated_un: { type: Boolean, required: false },
            valid_from: { type: Date, default: () => new Date(), required: false },
        }
    },
    status: { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date, default: () => new Date(), required: true },
});

module.exports = mongoose.model("fixed_asset", DefaulSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;
