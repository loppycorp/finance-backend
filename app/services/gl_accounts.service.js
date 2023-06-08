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

    const results = await Gl_accounts.aggregate(this.pipeline(filters))
    const gl_accounts = results[0];

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

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: Gl_accounts.STATUS_ACTIVE };

    const results = await Gl_accounts.aggregate(this.pipeline(options))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const gl_accountsData = results.map(o => this.mapData(o));

    const gl_accountsTotal = await Gl_accounts.countDocuments(options);

    return { data: gl_accountsData, total: gl_accountsTotal };
};

exports.getByCode = async (code, existing_id) => {
    const options = { 'header.gl_account_code': code, status: Gl_accounts.STATUS_ACTIVE };

    if (existing_id && existing_id != '')
        options['_id'] = { $ne: existing_id };

    return await Gl_accounts.countDocuments(options) > 0;

};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'companies',
                localField: 'header.company_code',
                foreignField: '_id',
                as: 'company_code'
            },
        },
        { $unwind: '$company_code' },
        {
            $lookup: {
                from: 'account_groups',
                localField: 'type_description.control_in_chart_of_accounts.account_group',
                foreignField: '_id',
                as: 'account_groups'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: '$account_groups',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'trading_partners',
                localField: 'type_description.consolidation_data_in_chart_of_accounts.trading_partner',
                foreignField: '_id',
                as: 'trading_partner'
            },
        },
        {
            $unwind: {
                path: '$trading_partner',
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'currencies',
                localField: 'control_data.account_control_in_company_code.account_currency',
                foreignField: '_id',
                as: 'account_currency'
            },
        },
        {
            $unwind: {
                path: '$account_currency',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'sort_keys',
                localField: 'control_data.account_management_in_company_code.sort_key',
                foreignField: '_id',
                as: 'sort_key'
            },
        },
        {
            $unwind: {
                path: '$sort_key',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'field_status_groups',
                localField: 'create_bank_interest.control_of_document_creation_in_company_code.field_status_group',
                foreignField: '_id',
                as: 'fsg'
            },
        },
        // if the id is optional or nullable
        {
            $unwind: {
                path: '$fsg',
                preserveNullAndEmptyArrays: true
            }
        },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    const { trading_partner, account_groups, account_currency, fsg, sort_key } = data;


    return {
        _id: data._id,
        header: {
            gl_account_code: data.header.gl_account_code,
            company_code: {
                _id: data.company_code._id,
                code: data.company_code.code,
                description: data.company_code.desc
            },
        },
        type_description: {
            control_in_chart_of_accounts: {
                account_group: (account_groups) ? {
                    _id: account_groups._id,
                    name: account_groups.name
                } : null,
                statement_account: data.type_description.control_in_chart_of_accounts.statement_account,
                balance_sheet_account: data.type_description.control_in_chart_of_accounts.balance_sheet_account,
            },
            description: data.type_description.description,

            consolidation_data_in_chart_of_accounts: {
                trading_partner: (trading_partner) ? trading_partner : null
            },
        },
        control_data: {
            account_control_in_company_code: {
                account_currency: (account_currency) ? {
                    _id: account_currency._id,
                    code: account_currency.code
                } : null,
                local_crcy: data.control_data.account_control_in_company_code.local_crcy,
                exchange_rate: data.control_data.account_control_in_company_code.exchange_rate,
                valuation_group: data.control_data.account_control_in_company_code.valuation_group,
                tax_category: data.control_data.account_control_in_company_code.tax_category,
                posting_tax_allowed: data.control_data.account_control_in_company_code.posting_tax_allowed,
            },
            account_management_in_company_code: {
                item_mgmt: data.control_data.account_management_in_company_code.item_mgmt,
                line_item: data.control_data.account_management_in_company_code.line_item,
                sort_key: (sort_key) ? {
                    _id: sort_key._id,
                    code: sort_key.code,
                    name: sort_key.name
                } : null,
            },
        },
        create_bank_interest: {
            control_of_document_creation_in_company_code: {
                field_status_group: (fsg) ? {
                    _id: fsg._id,
                    group_name: fsg.group_name,
                    description: fsg.description
                } : null,
                post_automatically: data.create_bank_interest.control_of_document_creation_in_company_code.post_automatically,
            },
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};