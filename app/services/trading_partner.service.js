const ObjectId = require('mongoose').Types.ObjectId;
const TradingPartner = require('../models/trading_partner.model');

exports.create = async (data) => {
    const tradingPartner = await TradingPartner.create(data);

    if (!tradingPartner) return false;

    return await this.get(tradingPartner._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: TradingPartner.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = TradingPartner.STATUS_INACTIVE;

    const tradingPartner = await TradingPartner.findOne(filters);

    if (!tradingPartner) return null;

    return this.mapData(tradingPartner);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const tradingPartner = await TradingPartner.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!tradingPartner) return false;

    return await this.get(tradingPartner._id);
};

exports.delete = async (id) => {
    const tradingPartner = await TradingPartner.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: TradingPartner.STATUS_INACTIVE }
    });

    if (!tradingPartner) return false;

    return await this.get(tradingPartner._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: TradingPartner.STATUS_ACTIVE };

    const results = await TradingPartner.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const tradingPartnerData = results.map(o => this.mapData(o));

    const tradingPartnerTotal = await TradingPartner.countDocuments(options);

    return { data: tradingPartnerData, total: tradingPartnerTotal };
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        code: data.code,
        name: data.name,
        desc: data.desc,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};