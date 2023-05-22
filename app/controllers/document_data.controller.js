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
const serviceDocumentType = require('../services/document_type.service');

//accrual
const reversal_reasons = require('../services/code_reversal_reason.service');
const ledger_groups = require('../services/code_ledger_group.service');
const posting_keys = require('../services/posting_key.service');
const currencies = require('../services/currency.service');
const profit_centers = require('../services/profit_center.service');
const segments = require('../services/segment.service');


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
        //accrual validation

        // Validate item reversal_reason record
        const itemReversalReasons = await reversal_reasons.get(header.reversal_reason);
        if (!itemReversalReasons && itemReversalReasons != null) {
            return {
                status: false,
                message: lang.t('document_data.err.reversal_reasons_not_exists'),
                error: {
                    index: i,
                    field: 'reversal_reason',
                    value: header.reversal_reason
                }
            };
        }
        // Validate item ledger_groups record
        const itemLedger = await ledger_groups.get(header.ledger_group);
        if (!itemLedger && itemLedger != null) {
            return {
                status: false,
                message: lang.t('document_data.err.ledger_item_not_exists'),
                error: {
                    index: i,
                    field: 'ledger_group',
                    value: header.ledger_group
                }
            };
        }
        // Validate item posting_key record
        const itemPk = await posting_keys.get(item.pk);
        if (!itemPk && itemPk != null) {
            return {
                status: false,
                message: lang.t('document_data.err.posting_key_not_exists'),
                error: {
                    index: i,
                    field: 'pk',
                    value: item.pk
                }
            };
        }

        // Validate item Currency record
        const itemCurr = await currencies.get(item.curr);
        if (!itemCurr && itemCurr != null) {
            return {
                status: false,
                message: lang.t('document_data.err.Currency_not_exists'),
                error: {
                    index: i,
                    field: 'curr',
                    value: item.curr
                }
            };
        }

        // Validate item profit_center record
        const itemProfit = await profit_centers.get(item.profit_center);
        if (!itemProfit && itemProfit != null) {
            return {
                status: false,
                message: lang.t('document_data.err.profit_center_not_exists'),
                error: {
                    index: i,
                    field: 'profit_center',
                    value: item.profit_center
                }
            };
        }
        // Validate item segments record
        const itemsegments = await segments.get(item.segment);
        if (!itemsegments && itemsegments != null) {
            return {
                status: false,
                message: lang.t('document_data.err.segment_item_not_exists'),
                error: {
                    index: i,
                    field: 'segment',
                    value: item.segment
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
        const query = req.query;

        const validate = await this.validate(body);
        if (!validate.status) {
            return res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });
        }

        // const documentType = await serviceDocumentType.getAll(req);
        // const ace = documentType.data;


        const data = await serviceDocumentdata.create(body, query);

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

exports.simulate = async (req, res) => {
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

        console.log(data);
        const post = await serviceDocumentdata.posting(params.id);

        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.posted"),
            data: post
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

exports.status = async (req, res) => {
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

        console.log(data);
        const post = await serviceDocumentdata.updateStatus(params.id);

        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.updated"),
            data: post
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
