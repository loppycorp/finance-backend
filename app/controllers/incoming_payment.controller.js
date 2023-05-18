const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const DefaultService = require("../services/incoming_payment.service");
const CompanyService = require("../services/company.service");
const profitService = require("../services/profit_center.service");
const { paramsSchema } = require("../helpers/validations/common.validation");
const { createSchema, updateSchema } = require("../helpers/validations/incoming_payment.validation");


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
        // validate company
        // const companyCode = await CompanyService.get(body.header.company_code);
        // if (!companyCode) {
        //     return {
        //         status: false,
        //         message: lang.t('company_code.err.not_exists')
        //     };
        // }
        // validate profit account
        // const profitCode = await profitService.get(body.bank_data.profit_center);
        // if (!profitCode) {
        //     return {
        //         status: false,
        //         message: lang.t('profit_center.err.not_exists')
        //     };
        // }
        const defaulService = await DefaultService.create(body);

        return res.status(200).send({
            status: "success",
            message: lang.t("incoming_payment.suc.create"),
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

        const defaultService = await DefaultService.get(params.id);
        if (!defaultService) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('incoming_payment.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('incoming_payment.suc.read'),
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

        const { data, total } = await DefaultService.getAll(query);

        return res.status(200).send({
            status: "success",
            message: lang.t("incoming_payment.suc..search"),
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

        const defaulService = await DefaultService.get(params.id);
        if (!defaulService) {
            return res.status(400).send({
                status: "error",
                message: lang.t("incoming_payment.err.not_exists"),
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

        const updated_defaulService = await DefaultService.update(
            defaulService._id,
            body
        );

        return res.status(200).send({
            status: "success",
            message: lang.t("incoming_payment.suc.update"),
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

        const defaulService = await DefaultService.get(params.id);
        if (!defaulService) {
            return res.status(400).send({
                status: "error",
                message: lang.t("incoming_payment.err.not_exists"),
            });
        }

        const deleted_defaulService = await DefaultService.delete(defaulService._id);

        return res.status(200).send({
            status: "success",
            message: lang.t("incoming_payment.suc.delete"),
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
