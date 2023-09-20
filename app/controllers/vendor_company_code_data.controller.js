const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const vendorService = require('../services/vendor_company_code_data.service');
const CompanyService = require('../services/company.service');
const tolerance_group_service = require('../services/code_tolerance_group.service');
const house_bank_service = require('../services/house_bank.service');
const cash_mgmnt_group_service = require('../services/code_cash_mgmnt_group.service');
const release_group_service = require('../services/code_release_group.service');
// const vendorsService = require('../services/vendor.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/vendor_company_code_data.validation');

exports.defaultsearch = async (req, res) => {
    try {
        logger.info(req.path);
        const query = req.query;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const searchTerm = decodeURIComponent(query);

        const { data, total } = await vendorService.search(searchTerm, query);

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
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });
            return false;
        }
        // validate profit_center_code
        const company_code = await CompanyService.
            get(body.header.company_code);
        if (!company_code && body.header.company_code != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('company_code.err.not_exists'),
            });
        }
        // validate tolerance_group
        const tolerance_group = await tolerance_group_service.
            get(body.payment_transactions.payment_data.tolerance_group);
        if (!tolerance_group && body.payment_transactions.payment_data.tolerance_group != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('tolerance_group.err.not_exists'),
            });
        }
        // validate tolerance_group
        const tolerance = await tolerance_group_service.
            get(body.payment_transactions.invoice_verification.tolerance_group);
        if (!tolerance && body.payment_transactions.invoice_verification.tolerance_group != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('tolerance_group.err.not_exists'),
            });
        }
        // validate house_bank
        const house_bank = await house_bank_service.
            get(body.payment_transactions.auto_payment_transactions.house_bank);
        if (!house_bank && body.payment_transactions.auto_payment_transactions.house_bank != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('house_bank.err.not_exists'),
            });
        }
        // validate cash_mgmnt_group
        const cash_mgmnt_group = await cash_mgmnt_group_service.
            get(body.account_management.accounting_information.cash_mgmnt_group);
        if (!cash_mgmnt_group && body.account_management.accounting_information.cash_mgmnt_group != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('cash_mgmnt_group.err.not_exists'),
            });
        }
        // validate release_group
        const release_group = await release_group_service.
            get(body.account_management.accounting_information.release_group);
        if (!release_group && body.account_management.accounting_information.release_group != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('release_group.err.not_exists'),
            });
        }
        const vendor = await vendorService.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.create'),
            data: vendor
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

exports.update = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;
        const params = req.params;

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
            return false;
        }

        const vendor = await vendorService.get(params.id);
        if (!vendor) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const validationBody = updateSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });
            return false;
        }

        const updateVendor = await vendorService.update(vendor._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.update'),
            data: updateVendor
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

exports.read = async (req, res) => {
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
            return false;
        }

        const vendor = await vendorService.get(params.id);
        if (!vendor) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.read'),
            data: user
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

        const { data, total } = await vendorService.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.search'),
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

exports.delete = async (req, res) => {
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
            return false;
        }

        const vendor = await vendorService.get(params.id);
        if (!vendor) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const deletedVendor = await vendorService.delete(user._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.delete'),
            data: deletedVendor
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