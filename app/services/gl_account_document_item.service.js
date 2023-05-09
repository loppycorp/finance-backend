const ObjectId = require("mongoose").Types.ObjectId;
const DefaultModel = require("../models/gl_account_document_item.model");

exports.create = async (data) => {
    const result = await DefaultModel.create(data);

    if (!result) return false;

    return await this.get(result._id);
};

exports.update = async (id, data) => {
    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, { $set: data });

    if (!result) return false;

    return await this.get(result._id);
};

exports.delete = async (id) => {
    const result = await DefaultModel.findOneAndUpdate({ _id: ObjectId(id) }, { $set: { 
        status: DefaultModel.STATUS_INACTIVE 
    } });

    if (!result) return false; 

    return await this.get(result._id, { display_inactive: true });
};

exports.get = async (id, options = {}) => {
    const results = await DefaultModel.aggregate(this.pipeline({ 
        _id: ObjectId(id),
        status: (options.display_inactive === true) 
            ? DefaultModel.STATUS_INACTIVE 
            : DefaultModel.STATUS_ACTIVE
    }));

    if (!results[0]) return null;

    return this.mapData(results[0]);
};

exports.getAll = async (query) => {
    const results = await DefaultModel.aggregate(this.pipeline({
        'gl_account_document_header._id': ObjectId(query.header_id),
        'status': DefaultModel.STATUS_ACTIVE
    })).sort({ date_created: -1 });

    const data = results.map(o => this.mapData(o));

    const summary = this.summary(data);

    return { data, summary };
};

exports.pipeline = (filters) => {
    return [
        {
            $lookup: {
                from: 'gl_account_document_headers',
                localField: 'gl_account_document_header',
                foreignField: '_id',
                as: 'gl_account_document_header'
            },
        },
        { $unwind: '$gl_account_document_header' },        
        {
            $lookup: {
                from: 'companies',
                localField: 'company',
                foreignField: '_id',
                as: 'company'
            },
        },
        { $unwind: '$company' },
        {
            $lookup: {
                from: 'gl_accounts',
                localField: 'gl_account',
                foreignField: '_id',
                as: 'gl_account'
            },
        },
        { $unwind: '$gl_account' },
        {
            $lookup: {
                from: 'cost_centers',
                localField: 'cost_center',
                foreignField: '_id',
                as: 'cost_center'
            },
        },
        { $unwind: '$cost_center' },
        {
            $lookup: {
                from: 'segments',
                localField: 'profit_segment',
                foreignField: '_id',
                as: 'profit_segment'
            },
        },
        {
            $unwind: { path: "$profit_segment", preserveNullAndEmptyArrays: true }
        },
        {
            $lookup: {
                from: 'posting_keys',
                localField: 'ptsky_type',
                foreignField: '_id',
                as: 'ptsky_type'
            },
        },
        { $unwind: '$ptsky_type' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        
        gl_account_document_header: { 
            _id: data.gl_account_document_header._id,
            doc_header_text: data.gl_account_document_header.doc_header_text
        },

        gl_account: {
            _id: data.gl_account._id,
            gl_account_id: data.gl_account.gl_account_id
        },

        company: { 
            _id: data.company._id,
            code: data.company.code,
            company_name: data.company.company_name
        },

        amount: data.amount,
        tax_code: data.tax_code,
        calculate_tax: data.calculate_tax,

        bussiness_place: data.bussiness_place,

        cost_center: { 
            _id: data.cost_center._id,
            cost_center_code: data.cost_center.cost_center_code,
            names: data.cost_center.names.name
        },
        order: data.order,

        wbs_element: data.wbs_element,
        profit_segment: (data.profit_segment)
            ? 
                {
                    id: data.profit_segment._id,
                    desc: data.profit_segment.desc 
                }
            : undefined,
        network: data.network,

        sales_order: data.sales_order,

        purchasing_doc: data.purchasing_doc,
        quantity: data.quantity,

        assignment: data.assignment,
        text: data.text,

        ptsky_type: { 
            _id: data.ptsky_type._id,
            posting_key_code: data.ptsky_type.posting_key.posting_key_code,
            name: data.ptsky_type.posting_key.name,
            type: data.ptsky_type.posting_key.type
        },
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};

exports.summary = (data) => {
    let types = {};
    let totalAmount = 0;
    let countItem = 0;
    let creditTypes = ['CREDIT'];

    data.map(o => { 
        if (!types[o.ptsky_type.type])
            types[o.ptsky_type.type] = { ...o.ptsky_type, subtotal: 0 };

        types[o.ptsky_type.type]['subtotal'] += parseFloat(o.amount);

        countItem++;
    });

    Object.values(types).map(o => {
        if (creditTypes.includes(o.type))
            totalAmount -= o.subtotal;
        else
            totalAmount += o.subtotal;
    });

    return {
        posting_keys: { ...types },
        total_amount: totalAmount,
        count_item: countItem
    };
}; 