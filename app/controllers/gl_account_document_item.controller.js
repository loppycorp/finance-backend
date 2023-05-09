const { logger } = require("../middlewares/logging.middleware");

const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");

const { createSchema } = require("../helpers/validations/gl_account_document_item.validation");

const documentHeaderService = require('../services/gl_account_document_header.service');
const documentItemService = require('../services/gl_account_document_item.service');

const companyService = require('../services/company.service');
const glAccountService = require('../services/gl_accounts.service');
const costCenterSerrvice = require('../services/cost_center.service');
const segmentService = require('../services/segment.service');
const postKeyService = require("../services/posting_key.service");

const { paramsSchema } = require('../helpers/validations/common.validation');

let header;

exports.validate = async (dataset) => {
    const { params, body } = dataset;

    const validationParams = paramsSchema.validate(params, { abortEarly: false });
    if (validationParams.error) {
        return {
            status: false,
            message: lang.t('global.err.validation_failed'),
            error: validationParams.error.details
        };
    }

    const validationBody = createSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
        return {
            status: false,
            message: lang.t('global.err.validation_failed'),
            error: validationBody.error.details
        };
    }

    header = await documentHeaderService.get(params.id);
    if (!header) {
        return {
            status: false,
            message: lang.t('gl_account_doc_header.err.not_exists')
        };
    }

    const company = await companyService.get(body.company);
    if (!company) {
        return {
            status: false,
            message: lang.t('company.err.not_exists')
        };
    }

    const glAccount = await glAccountService.get(body.gl_account);
    if (!glAccount) {
        return {
            status: false,
            message: lang.t('gl_accounts.err.not_exists')
        }
    }

    const costCenter = await costCenterSerrvice.get(body.cost_center);
    if (!costCenter) {
        return {
            status: false,
            message: lang.t('cost_center.err.not_exists')
        }
    }

    const segment = await segmentService.get(body.profit_segment);
    if (!segment) {
        return {
            status: false,
            message: lang.t('profit_segment.err.not_exists')
        }
    }

    const postKey = await postKeyService.get(body.ptsky_type);
    if (!postKey) {
      return {
        status: "error",
        message: lang.t("posting_key.err.not_exists"),
      };
    }

    return { status: true };
};


exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        const { params, body } = req;

        const validate = await this.validate({ params, body });
        if (!validate.status) {
            return res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });
        }

        body.gl_account_document_header = header._id;
        
        const data = await documentItemService.create(body);

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_item.suc.created"),
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

        const validate = await this.validate({ params, body });
        if (!validate.status) {
            return res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });
        }

        const item = await documentItemService.get(params.item_id);
        if (!item) {
            return res.status(400).send({
                status: "error",
                message: lang.t('gl_account_doc_item.err.not_exists')
            });
        }
        
        const data = await documentItemService.update(item._id, body);

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_item.suc.updated_record"),
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
            return {
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validationParams.error.details
            };
        }

        const header = await documentHeaderService.get(params.id);
        if (!header) {
            return {
                status: false,
                message: lang.t('gl_account_doc_header.err.not_exists')
            };
        }

        const item = await documentItemService.get(params.item_id);
        if (!item) {
            return res.status(400).send({
                status: "error",
                message: lang.t('gl_account_doc_item.err.not_exists')
            });
        }
        
        const data = await documentItemService.delete(item._id);

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_item.suc.deleted_record"),
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

exports.get = async (req, res) => {
    try {
        logger.info(req.path);

        const { params } = req;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return {
                status: false,
                message: lang.t('global.err.validation_failed'),
                error: validationParams.error.details
            };
        }

        const header = await documentHeaderService.get(params.id);
        if (!header) {
            return {
                status: false,
                message: lang.t('gl_account_doc_header.err.not_exists')
            };
        }

        const data = await documentItemService.get(params.item_id);
        if (!data) {
            return res.status(400).send({
                status: "error",
                message: lang.t('gl_account_doc_item.err.not_exists')
            });
        }
    
        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_item.suc.fetched_record"),
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

        const { params } = req;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
        }

        const header = await documentHeaderService.get(params.id);
        if (!header) {
            return res.status(400).send({
                status: "error",
                message: lang.t('gl_account_doc_header.err.not_exists')
            });
         }     

        const { data, summary } = await documentItemService.getAll({ header_id: params.id });

        return res.status(200).send({
            status: "success",
            message: lang.t("gl_account_doc_item.suc.fetched_records"),
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