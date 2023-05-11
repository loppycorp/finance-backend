const { logger } = require('../middlewares/logging.middleware');

const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');

const { validateParamsSchema } = require("../helpers/validations/common.validation");
const { validateBodySchema } = require('../helpers/validations/document_data.validation');

const serviceDocumentdata = require('../services/document_data.service');
const serviceCompany = require('../services/company.service');
const serviceCurrency = require('../services/currency.service');
const serviceTrading = require('../services/trading_partner.service');
const serviceCost = require('../services/cost_center.service');

exports.validate = async (body) => {
    const validationBody = validateBodySchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
        return {
            status: false,
            message: lang.t('global.err.validation_failed'),
            error: validationBody.error.details
        };
    }

    const { header, items } = body;

    // Validate company code record
    const company = await serviceCompany.get(header.company_code);
    if (!company) {
        return {
            status: false,
            message: lang.t('document_data.err.company_not_exists')
        };
    }

    // Validate currency record
    const currency = await serviceCurrency.get(header.currency);
    if (!currency) {
        return {
            status: false,
            message: lang.t('document_data.err.currency_not_exists')
        };
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        // Validate item company code record
        const itemCompany = await serviceCompany.get(item.company_code);
        if (!itemCompany) {
            return {
                status: false,
                message: lang.t('document_data.err.company_item_not_exists'),
                error: {
                    index: i,
                    field: 'company_code',
                    value: item.company_code
                }
            };
        }
    
        // Validate item trading part ba record
        const itemTrading = await serviceTrading.get(item.trading_part_ba);
        if (!itemTrading) {
            return {
                status: false,
                message: lang.t('document_data.err.trading_item_not_exists'),
                error: {
                    index: i,
                    field: 'trading_part_ba',
                    value: item.trading_part_ba
                }
            };
        }

        // Validate item cost center record
        const itemCostCenter = await serviceCost.get(item.cost_center);
        if (!itemCostCenter) {
            return {
                status: false,
                message: lang.t('document_data.err.trading_item_not_exists'),
                error: {
                    index: i,
                    field: 'cost_center',
                    value: item.cost_center
                }
            };
        }

    }

    return { status: true };
};

exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;

        const validate = await this.validate(body);
        if (!validate.status) {
            return res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });
        }

        const data = await serviceDocumentdata.create(body);

        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.created"),
            data: data
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: "error",
            message: utilities.getMessage(err),
        });
    }
};

exports.read = async (req, res) => {
    try {
        logger.info(req.path);
        
        const { params } = req;

        const validateParams = validateParamsSchema.validate(params, { abortEarly: false });
        if (validateParams.error) {
            return {
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validateParams.error.details
            };
        }

        const data = await serviceDocumentdata.get(params.id);
        if (!data) {
            return res.status(200).send({
                status: "error",
                message: lang.t("document_data.error.not_exists")
            });
        }

        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.read"),
            data: data
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: "error",
            message: utilities.getMessage(err),
        });
    }
};

exports.update = async (req, res) => {
    try {
        logger.info(req.path);
        
        const { params, body } = req;

        const validateParams = validateParamsSchema.validate(params, { abortEarly: false });
        if (validateParams.error) {
            return {
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validateParams.error.details
            };
        }

        const data = await serviceDocumentdata.get(params.id);
        if (!data) {
            return res.status(200).send({
                status: "error",
                message: lang.t("document_data.error.not_exists")
            });
        }

        const validate = await this.validate(body);
        if (!validate.status) {
            return res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });
        }

        const updated = await serviceDocumentdata.update(params.id, body);

        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.updated"),
            data: updated
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: "error",
            message: utilities.getMessage(err),
        });
    }
};

exports.delete = async (req, res) => {
    try {
        logger.info(req.path);

        const { params, body } = req;

        const validateParams = validateParamsSchema.validate(params, { abortEarly: false });
        if (validateParams.error) {
            return {
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validateParams.error.details
            };
        }

        const data = await serviceDocumentdata.get(params.id);
        if (!data) {
            return res.status(200).send({
                status: "error",
                message: lang.t("document_data.error.not_exists"),
            });
        }

        const deleted = await serviceDocumentdata.delete(params.id);
        
        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.deleted"),
            data: deleted
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: "error",
            message: utilities.getMessage(err),
        });
    }
};

exports.search = async (req, res) => {
    try {
        logger.info(req.path);

        const { query } = req;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const { data, total } = await serviceDocumentdata.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.search'),
            data: data,
            pagination: {
                page_num: pageNum,
                page_limit: pageLimit,
                page_count: data.length,
                sort_order: sortOrder,
                sort_by: sortBy,
                total_result: total
            }
        });

        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.search"),
            data: data
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: "error",
            message: utilities.getMessage(err),
        });
    }
};
