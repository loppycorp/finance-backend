const ObjectId = require('mongoose').Types.ObjectId;
const Fixed_asset = require('../models/fixed_asset.model');


exports.create = async (data) => {
    const fixed_asset = await Fixed_asset.create(data);

    if (!fixed_asset) return false;

    return await this.get(fixed_asset._id)
};
exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Fixed_asset.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Fixed_asset.STATUS_INACTIVE;

    const results = await Fixed_asset.aggregate(this.pipeline(filters))
    const fixed_asset = results[0];

    if (!fixed_asset) return null;

    return this.mapData(fixed_asset);
};
exports.update = async (id, data) => {
    data.date_updated = new Date();

    const fixed_asset = await Fixed_asset.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!fixed_asset) return false;

    return await this.get(fixed_asset._id);
};
exports.delete = async (id) => {
    const fixed_asset = await Fixed_asset.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Fixed_asset.STATUS_INACTIVE }
    });

    if (!fixed_asset) return false;

    return await this.get(fixed_asset._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Fixed_asset.STATUS_ACTIVE };

    const results = await Fixed_asset.aggregate(this.pipeline(options))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const fixed_assetData = results.map(o => this.mapData(o));

    const fixed_assetTotal = await Fixed_asset.countDocuments(options);

    return { data: fixed_assetData, total: fixed_assetTotal };
};
exports.pipeline = (filters) => {
    return [
        // {
        //     $lookup: {
        //         from: 'materials',
        //         localField: 'header.material',
        //         foreignField: '_id',
        //         as: 'material'
        //     },
        // },
        {
            $lookup: {
                from: 'industry_sectors',
                localField: 'header.industry_sector',
                foreignField: '_id',
                as: 'industry_sector'
            },
        },
        { $unwind: '$industry_sector' },
        {
            $lookup: {
                from: 'material_types',
                localField: 'header.material_type',
                foreignField: '_id',
                as: 'material_type'
            },
        },
        { $unwind: '$material_type' },
        {
            $lookup: {
                from: 'plants',
                localField: 'header.plant',
                foreignField: '_id',
                as: 'plant'
            },
        },
        { $unwind: '$plant' },
        {
            $lookup: {
                from: 'stor_locations',
                localField: 'header.stor_location',
                foreignField: '_id',
                as: 'stor_location'
            },
        },
        { $unwind: '$stor_location' },
        { $unwind: '$base_unit_of_measure' },
        {
            $lookup: {
                from: 'material_groups',
                localField: 'basic_data1.general_data.material_group',
                foreignField: '_id',
                as: 'material_group'
            },
        },
        { $unwind: '$material_group' },

        {
            $lookup: {
                from: 'purchasing_groups',
                localField: 'purchasing.general_data.purchasing_group',
                foreignField: '_id',
                as: 'purchasing_group'
            },
        },
        { $unwind: '$purchasing_group' },

        {
            $lookup: {
                from: 'material_groups',
                localField: 'purchasing.general_data.material_group',
                foreignField: '_id',
                as: 'material_group'
            },
        },
        { $unwind: '$material_group' },
        {
            $lookup: {
                from: 'currencies',
                localField: 'foreign_trade_import.excise_data.currency_key',
                foreignField: '_id',
                as: 'currency_key'
            },
        },
        { $unwind: '$currency_key' },
        {
            $lookup: {
                from: 'material_types',
                localField: 'foreign_trade_import.excise_data.material_type',
                foreignField: '_id',
                as: 'material_type'
            },
        },
        { $unwind: '$material_type' },
        {
            $lookup: {
                from: 'meatures',
                localField: 'plant_data_stor_1.general_data.base_unit_of_measure',
                foreignField: '_id',
                as: 'base_unit_of_measure'
            },
        },
        { $unwind: '$base_unit_of_measure' },
        {
            $lookup: {
                from: 'profit_centers',
                localField: 'plant_data_stor_2.general_plant_parameters.profit_center',
                foreignField: '_id',
                as: 'profit_center'
            },
        },
        { $unwind: '$profit_center' },
        {
            $lookup: {
                from: 'currencies',
                localField: 'accounting_1.general_data.currency',
                foreignField: '_id',
                as: 'currency'
            },
        },
        { $unwind: '$currency' },

        // if the id is optional or nullable
        { $unwind: '$field_status_group' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header: {
            material: data.header.material,
            industry_sector: {
                _id: data.industry_sector._id,
                code: data.industry_sector.code,
                description: data.industry_sector.desc
            },
            material_type: {
                _id: data.material_type._id,
                code: data.material_type.code,
                description: data.material_type.desc
            },
            change_number: data.header.change_number,
            plant: {
                _id: data.plant._id,
                code: data.plant.code,
                description: data.plant.desc
            },
            stor_location: {
                _id: data.stor_location._id,
                code: data.stor_location.code,
                description: data.stor_location.desc
            },
        },
        basic_data1: {
            general_data: {
                base_unit_of_measure: data.basic_data1.general_data.base_unit_of_measure,
                old_material_number: data.basic_data1.general_data.old_material_number,
                division: data.basic_data1.general_data.division,
                product_allocation: data.basic_data1.general_data.product_allocation,
                x_plant_matl_status: data.basic_data1.general_data.x_plant_matl_status,
                assign_effet_vals: data.basic_data1.general_data.assign_effet_vals,
                material_group: {
                    _id: data.material_group._id,
                    code: data.material_group.code,
                    description: data.material_group.desc
                },
                ext_matl_group: data.basic_data1.general_data.ext_matl_group,
                lab_office: data.basic_data1.general_data.lab_office,
                valid_from: data.basic_data1.general_data.valid_from,
                gen_item_cat_group: data.basic_data1.general_data.gen_item_cat_group,
            },
            material_authorization_group: data.basic_data1.material_authorization_group,
            dimensions_eans: data.basic_data1.dimensions_eans,
            packaging_materil_data: data.basic_data1.packaging_materil_data
        },

        purchasing: {
            general_data: {
                base_unit_of_measure: data.purchasing.general_data.base_unit_of_measure,
                purchasing_group: {
                    _id: data.purchasing_group._id,
                    code: data.purchasing_group.code,
                    description: data.purchasing_group.desc
                },
                plant_sp_matl_status: data.purchasing.general_data.plant_sp_matl_status,
                tax_ind_f_material: data.purchasing.general_data.tax_ind_f_material,
                material_freight_grp: data.purchasing.general_data.material_freight_grp,
                batch_management: data.purchasing.general_data.batch_management,
                order_unit: data.purchasing.general_data.order_unit,
                material_group: {
                    _id: data.material_group._id,
                    code: data.material_group.code,
                    description: data.material_group.desc
                },
                valid_from: data.purchasing.general_data.valid_from,
                qual_f_free_goods_dis: data.purchasing.general_data.qual_f_free_goods_dis,
                autom_po: data.purchasing.general_data.autom_po,
                var_oun: data.purchasing.general_data.var_oun,
            },

            purchasing_value: data.purchasing.purchasing_value,
            other_data_manufacturer_data: data.purchasing.other_data_manufacturer_data
        },


        foreign_trade_import: {
            cas_number: data.foreign_trade_import.cas_number,
            prodcom_no: data.foreign_trade_import.prodcom_no,
            control_code: data.foreign_trade_import.control_code,
            origin_eu_market_organization_preferences: data.foreign_trade_import.origin_eu_market_organization_preferences,
            legal_control: data.foreign_trade_import.egal_control,
            excise_data: {
                chapter_id: data.foreign_trade_import.excise_data.chapter_id,
                no_grs_per_ei: data.foreign_trade_import.excise_data.no_grs_per_ei,
                valid_from: data.foreign_trade_import.excise_data.valid_from,
                currency_key: {
                    _id: data.currency_key._id,
                    code: data.currency_key.code,
                    description: data.currency_key.desc
                },
                net_dealer_price: data.foreign_trade_import.excise_data.net_dealer_price,
                subcontractors: data.foreign_trade_import.excise_data.subcontractors,
                output_matl: data.foreign_trade_import.excise_data.output_matl,
                assessable_val: data.foreign_trade_import.excise_data.assessable_val,
                material_type: {
                    _id: data.material_type._id,
                    code: data.material_type.code,
                    description: data.material_type.desc
                },
            },
        },

        plant_data_stor_1: {
            general_data: {
                base_unit_of_measure: {
                    _id: data.base_unit_of_measure._id,
                    code: data.base_unit_of_measure.code,
                    description: data.base_unit_of_measure.desc
                },
                storage_bin: data.plant_data_stor_1.general_data.storage_bin,
                temp_conditions: data.plant_data_stor_1.general_data.temp_conditions,
                container_reqmts: data.plant_data_stor_1.general_data.container_reqmts,
                cc_phys_inv_ind: data.plant_data_stor_1.general_data.cc_phys_inv_ind,
                label_type: data.plant_data_stor_1.general_data.label_type,
                batch_management: data.plant_data_stor_1.general_data.batch_management,
                cc_fixed: data.plant_data_stor_1.general_data.cc_fixed,
                lab_form: data.plant_data_stor_1.general_data.lab_form,
                unit_of_issue: data.plant_data_stor_1.general_data.unit_of_issue,
                picking_area: data.plant_data_stor_1.general_data.picking_area,
                storage_conditions: data.plant_data_stor_1.general_data.storage_conditions,
                haz_material_number: data.plant_data_stor_1.general_data.haz_material_number,
                number_of_gr_slips: data.plant_data_stor_1.general_data.number_of_gr_slips,
                appr_batch_rec_req: data.plant_data_stor_1.general_data.appr_batch_rec_req,
            },
            shelf_life_data: data.plant_data_stor_1.shelf_life_data
        },


        plant_data_stor_2: {
            weight_volume: data.plant_data_stor_2.weight_volume,
            general_plant_parameters: {
                neg_stocks_in_plant: data.plant_data_stor_2.general_plant_parameters.neg_stocks_in_plant,
                serial_no_profile: data.plant_data_stor_2.general_plant_parameters.serial_no_profile,
                profit_center: {
                    _id: data.profit_center.basic_data.description._id,
                    code: data.profit_center.basic_data.description.profit_center_code,
                    description: data.profit_center.basic_data.description.name
                },
                serlevel: data.plant_data_stor_2.general_plant_parameters.serlevel,
                log_handling_group: data.plant_data_stor_2.general_plant_parameters.log_handling_group,
                distr_profile: data.plant_data_stor_2.general_plant_parameters.distr_profile,
                stock_detem_group: data.plant_data_stor_2.general_plant_parameters.stock_detem_group,
            },
        },

        accounting_1: {
            general_data: {
                base_unit_of_measure: {
                    _id: data.base_unit_of_measure._id,
                    code: data.base_unit_of_measure.code,
                    description: data.base_unit_of_measure.desc
                },
                currency: {
                    _id: data.currency._id,
                    code: data.currency.code,
                    name: data.currency.name,
                    description: data.currency.desc,
                },
                division: data.accounting_1.general_data.division,
                valuation_category: data.accounting_1.general_data.valuation_category,
                current_period: data.accounting_1.general_data.current_period,
                price_determ: data.accounting_1.general_data.price_determ,
            },
            current_valuation: data.accounting_1.current_valuation
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};