const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const DefaulService = require("../services/customer_general_data.service");
const CompanyService = require("../services/company.service");
const { createSchema, updateSchema, } = require("../helpers/validations/customer_general_data.validation");
exports.defaultsearch = async (req, res) => {
    try {
        logger.info(req.path);
        const query = req.query;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const searchTerm = decodeURIComponent(query);

        const { data, total } = await DefaulService.search(searchTerm, query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('suc.search'),
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
    } catch (err) {
        logger.error(req.path);
        logger.error(err);
        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};


exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;

        const validationBody = createSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            return res.status(400).send({
                status: "error",
                message: lang.t("global.err.validation_failed"),
                error: validationBody.error.details,
            });

        }

        // validate profit_center_code
        const code = await DefaulService.getByCode(body.header.customer_code);
        if (code) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('customer already exists')
            });
        }
        // validation company code
        const companyCode = await CompanyService.get(body.header.company_code);
        if (!companyCode) {
            return {
                status: false,
                message: lang.t('company.err.not_exists')
            };
        }
        const defaulService = await DefaulService.create(body);

        return res.status(200).send({
            status: "success",
            message: lang.t("customer.suc.create"),
            data: defaulService,
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

        const params = req.params;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
        }

        const defaultService = await DefaulService.get(params.id);
        if (!defaultService) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('customer.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('customer.suc.read'),
            data: defaultService
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        return res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};

exports.search = async (req, res) => {
    try {
        logger.info(req.path);

        const query = req.query;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const { data, total } = await DefaulService.getAll(query);

        return res.status(200).send({
            status: "success",
            message: lang.t("customer.suc..search"),
            data: data,
            pagination: {
                page_num: pageNum,
                page_limit: pageLimit,
                page_count: data.length,
                sort_order: sortOrder,
                sort_by: sortBy,
                total_result: total,
            },
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

        const body = req.body;
        const params = req.params;

        const validationParams = paramsSchema.validate(params, {
            abortEarly: false,
        });
        if (validationParams.error) {
            return res.status(400).send({
                status: "error",
                message: lang.t("global.err.validation_failed"),
                error: validationParams.error.details,
            });
            return false;
        }

        const defaulService = await DefaulService.get(params.id);
        if (!defaulService) {
            return res.status(400).send({
                status: "error",
                message: lang.t("customer.err.not_exists"),
            });
        }

        const validationBody = updateSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            return res.status(400).send({
                status: "error",
                message: lang.t("global.err.validation_failed"),
                error: validationBody.error.details,
            });
            return false;
        }

        const updated_defaulService = await DefaulService.update(
            defaulService._id,
            body
        );

        return res.status(200).send({
            status: "success",
            message: lang.t("customer.suc.update"),
            data: updated_defaulService,
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

        const params = req.params;

        const validationParams = paramsSchema.validate(params, {
            abortEarly: false,
        });
        if (validationParams.error) {
            return res.status(400).send({
                status: "error",
                message: lang.t("global.err.validation_failed"),
                error: validationParams.error.details,
            });
            return false;
        }

        const defaulService = await DefaulService.get(params.id);
        if (!defaulService) {
            return res.status(400).send({
                status: "error",
                message: lang.t("customer.err.not_exists"),
            });
        }

        const deleted_defaulService = await DefaulService.delete(defaulService._id);

        return res.status(200).send({
            status: "success",
            message: lang.t("customer.suc.delete"),
            data: deleted_defaulService,
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
