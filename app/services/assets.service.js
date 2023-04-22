const ObjectId = require('mongoose').Types.ObjectId;
const Assets = require('../models/assets.model');

exports.create = async (data) => {
    const assets = await Assets.create(data);

    if (!assets) return false;

    return await this.get(assets._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Assets.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Assets.STATUS_INACTIVE;

    const assets = await Assets.findOne(filters);

    if (!assets) return null;

    return this.mapData(assets);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const assets = await Assets.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!assets) return false;

    return await this.get(assets._id);
};

exports.delete = async (id) => {
    const assets = await Assets.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Assets.STATUS_INACTIVE }
    });

    if (!assets) return false;

    return await this.get(assets._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Assets.STATUS_ACTIVE };

    const results = await Assets.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const companiesData = results.map(o => this.mapData(o));

    const companiesTotal = await Assets.countDocuments(options);

    return { data: companiesData, total: companiesTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        asset_class: data.asset_class,
        company_code: data.company_code,
        number_of_similar_assets: data.number_of_similar_assets,
        class: data.class,
        description: data.description,
        asset_main_no: data.asset_main_no,
        acct_determination: data.acct_determination,
        serial_number: data.serial_number,
        inventory_number: data.inventory_number,
        quantity: data.quantity,
        manage_historically: data.anage_historically,
        last_inventory_on: data.last_inventory_on,
        inventory_note: data.inventory_note,
        include_asset_in_inventory_list: data.include_asset_in_inventory_list,
        capitalized_on: data.capitalized_on,
        first_acquisition_on: data.first_acquisition_on,
        acquisition_year: data.acquisition_year,
        deactivation_on: data.deactivation_on,
        cost_center: data.cost_center,
        plant: data.plant,
        location: data.location,
        room: data.room,
        shift_factor: data.shift_factor,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};