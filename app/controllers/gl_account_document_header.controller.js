const { logger } = require("../middlewares/logging.middleware");

const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");

const { paramsSchema } = require("../helpers/validations/common.validation");
const { createSchema } = require("../helpers/validations/gl_account_document_header.validation");

const documentHeaderService = require("../services/gl_account_document_header.service");

const docTypeService = require("../services/document_type.service");
const currencytService = require('../services/currency.service');
const companyService = require('../services/company.service');
const fiscalService = require("../services/fiscal_period.service");

exports.validate = async (body) => {
    const validationBody = createSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
        return {
            status: false,
            message: lang.t('global.err.validation_failed'),
            error: validationBody.error.details
        };
    }

    const type = await docTypeService.get(body.type);
    if (!type) {
        return {
            status: false,
            message: lang.t("document_type.err.not_exists")
        };
    }

    const company = await companyService.get(body.company);
    if (!company) {
        return {
            status: false,
            message: lang.t('company.err.not_exists')
        };
    }

    const period = await fiscalService.get(body.period);
    if (!period) {
        return {
            status: false,
            message: lang.t("fiscal_period.err.not_exists")
        };
    }

    const currency = await currencytService.get(body.currency);
    if (!currency) {
        return {
            status: false,
            message: lang.t('currency.err.not_exists')
        };
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

        const data = await documentHeaderService.create(body);

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_header.suc.created_record"),
            data: data,
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

        const { data, summary } = await documentHeaderService.getAll(query);

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_header.suc.fetched_records"),
            data: data,
            summary: summary,
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

exports.get = async (req, res) => {
    try {
        logger.info(req.path);

        const { params } = req;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validationParams.error.details
            });
        }

        const data = await documentHeaderService.get(params.id);
        if (!data) {
            return res.status(400).send({
                status: false,
                message: lang.t('gl_account_doc_header.err.not_exists')
            });
        }

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_header.suc.fetched_record"),
            data: data,
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

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validationParams.error.details
            });
        }

        const header = await documentHeaderService.get(params.id);
        if (!header) {
            return res.status(400).send({
                status: false,
                message: lang.t('gl_account_doc_header.err.not_exists')
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

        const data = await documentHeaderService.update(header._id, body);

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_header.suc.updated_record"),
            data: data,
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

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validationParams.error.details
            });
        }

        const header = await documentHeaderService.get(params.id);
        if (!header) {
            return res.status(400).send({
                status: false,
                message: lang.t('gl_account_doc_header.err.not_exists')
            });
        }

        const data = await documentHeaderService.delete(header._id);

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_header.suc.deleted_record"),
            data: data,
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
