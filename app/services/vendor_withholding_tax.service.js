const ObjectId = require('mongoose').Types.ObjectId;
const DefaultModel = require('../models/vendor_withholding_tax.model');
const vendorModel = require('../models/vendor_withholding_tax.model');

exports.create = async (data) => {
    const DefaultModel = await vendorModel.create(data);

    if (!DefaultModel) return false;

    return await this.get(DefaultModel._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: DefaultModel.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = DefaultModel.STATUS_INACTIVE;

    const results = await DefaultModel.aggregate(this.pipeline(filters))
    const vendorWithholdingTax = results[0];

    if (!vendorWithholdingTax) return null;

    return this.mapData(vendorWithholdingTax);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const vendorWithholdingTax = await DefaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!vendorWithholdingTax) return false;

    return await this.get(vendorWithholdingTax._id);
};

exports.delete = async (id) => {
    const vendorWithholdingTax = await DefaultModel.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: DefaultModel.STATUS_INACTIVE }
    });

    if (!vendorWithholdingTax) return false;

    return await this.get(vendorWithholdingTax._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const filters = { status: DefaultModel.STATUS_ACTIVE };

    const results = await DefaultModel.aggregate(this.pipeline(filters))
        .collation({ 'locale': 'en' }).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const vendorWithholdingTaxData = results.map(o => this.mapData(o));

    const vendorWithholdingTaxTotal = await DefaultModel.countDocuments(filters);

    return { data: vendorWithholdingTaxData, total: vendorWithholdingTaxTotal };
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
                from: 'vendor_general_datas',
                localField: 'header.vendor',
                foreignField: '_id',
                as: 'vendor'
            },
        },
        { $unwind: '$vendor' },
        { $match: filters }
    ];
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        header:{
            vendor: { 
                _id: data.vendor._id,
                vendor_code: data.vendor.vendor_code,
                account_code: data.vendor.account_code
            },
            company_code: { 
                _id: data.company_code._id,
                code: data.company_code.code,
                description: data.company_code.desc
            },
        
            wh_tax_country: data.header.wh_tax_country,
        },
            with_tax_information: {
                wth_t_ty: data.with_tax_information.wth_t_ty,
                w_tax_c: data.with_tax_information.w_tax_c,
                liable: data.with_tax_information.liable,
                rec_ty: data.with_tax_information.rec_ty,
                w_tax_id: data.with_tax_information.w_tax_id,
                exemption_number: data.with_tax_information.exemption_number,
                exem: data.with_tax_information.exem,
                exmpt_r: data.with_tax_information.exmpt_r,
                exempt_form: data.with_tax_information.exempt_form,
                exempt_to: data.with_tax_information.exempt_to,
                description: data.with_tax_information.description,
            },
            status: data.status,
            date_created: data.date_created,
            date_updated: data.date_updated
    }
};