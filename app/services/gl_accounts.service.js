const ObjectId = require('mongoose').Types.ObjectId;
const Gl_accounts = require('../models/gl_accounts.model');


exports.create = async (data) => {
    const gl_accounts = await Gl_accounts.create(data);

    if (!gl_accounts) return false;

    return await this.get(gl_accounts._id)
};
exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: Gl_accounts.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = Gl_accounts.STATUS_INACTIVE;

    const gl_accounts = await Gl_accounts.findOne(filters);

    if (!gl_accounts) return null;

    return this.mapData(gl_accounts);
};
exports.update = async (id, data) => {
    data.date_updated = new Date();

    const gl_accounts = await Gl_accounts.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!gl_accounts) return false;

    return await this.get(gl_accounts._id);
};
exports.delete = async (id) => {
    const gl_accounts = await Gl_accounts.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: Gl_accounts.STATUS_INACTIVE }
    });

    if (!gl_accounts) return false;

    return await this.get(gl_accounts._id, { allowed_inactive: true });
};
exports.mapData = (data) => {
    return {
        _id: data._id,
        gl_account_id: data.gl_account_id,
        company_code_id: data.company_code_id,
        account_group: data.account_group,
        statement_account: data.statement_account,
        balance_sheet_account: data.balance_sheet_account,
        short_text: data.short_text,
        long_text: data.long_text,
        trading_partner: data.trading_partner,
        account_currency: data.account_currency,
        local_crcy: data.local_crcy,
        exchange_rate: data.exchange_rate,
        valuation_group: data.valuation_group,
        tax_category: data.tax_category,
        posting_tax_allowed: data.posting_tax_allowed,
        item_mgmt: data.item_mgmt,
        line_item: data.line_item,
        sort_key: data.sort_key,
        field_status_group: data.field_status_group,
        post_automatically: data.post_automatically,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};
exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Gl_accounts.STATUS_ACTIVE };

    const results = await Gl_accounts.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const gl_accountsData = results.map(o => this.mapData(o));

    const gl_accountsTotal = await Gl_accounts.countDocuments(options);

    return { data: gl_accountsData, total: gl_accountsTotal };
};

