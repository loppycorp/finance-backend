const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const DefaultService = require('../services/cheque_lot.service');
const companyService = require('../services/company.service');
const glAccountService = require('../services/gl_accounts.service');
const houseBankService = require('../services/house_bank.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/cheque_lot.validation');

exports.defaultsearch = async (req, res) => {
    try {
        logger.info(req.path);
        const query = req.query;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const searchTerm = decodeURIComponent(query);

        const { data, total } = await DefaultService.search(searchTerm, query);

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

        // validate company_code
        const company = await companyService.get(body.header.paying_company_code);
        if (!company) {
            return {
                status: false,
                message: lang.t('company.err.not_exists')
            };
        }

        // validate gl_account_id
        const glAccount = await glAccountService.get(body.header.gl_account);
        if (!glAccount) {
            return {
                status: false,
                message: lang.t('gl_account.err.not_exists')
            };
        }

        // validate house_bank_id
        const houseBank = await houseBankService.get(body.header.house_bank);
        if (!houseBank) {
            return {
                status: false,
                message: lang.t('houseBank.err.not_exists')
            };
        }

        // validate bank_key_code
        const lotNumber = await DefaultService.get(body.lot.lot_number);
        if (lotNumber) {
            return {
                status: false,
                message: lang.t('lot_number.err.already_exists')
            };

        }
        /// check the cheque range if exists
        const codeExists = await DefaultService.checkIfCodeExists(
            body.lot.lot.cheque_number_from,
            body.lot.lot.cheque_number_to,
        );

        if (codeExists) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('Cheque range already exists.'),
            });
        }

        const defaulService = await DefaultService.create(body);

        return res.status(200).send({
            status: "success",
            message: lang.t("cheque_lot.suc.create"),
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
                message: lang.t('customer_withholding_tax.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('customer_withholding_tax.suc.read'),
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
            message: lang.t("customer_withholding_tax.suc..search"),
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
                message: lang.t("customer_withholding_tax.err.not_exists"),
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
            message: lang.t("customer_withholding_tax.suc.update"),
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
                message: lang.t("customer_withholding_tax.err.not_exists"),
            });
        }

        const deleted_defaulService = await DefaulService.delete(defaulService._id);

        return res.status(200).send({
            status: "success",
            message: lang.t("customer_withholding_tax.suc.delete"),
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
