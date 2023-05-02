const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const vendorService = require('../services/vendor.service');
const vendorPaymentTransactionsService = require('../services/vendor_pymnt_transc.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/vendor_pymnt_transc.validation');


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

        // validate vendor_id
        const vendors = await vendorService.get(body.vendor_id);
        if (!vendors) {
            return {
                status: false,
                message: lang.t('vendor.err.not_exists')
            };
        }
        const vendor = await vendorPaymentTransactionsService.create(body);

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

        const vendor = await vendorPaymentTransactionsService.get(params.id);
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

        const updateVendor = await vendorPaymentTransactionsService.update(vendor._id, body);

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

        const vendor = await vendorPaymentTransactionsService.get(params.id);
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

        const { data, total } = await vendorPaymentTransactionsService.getAll(query);

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

        const vendor = await vendorPaymentTransactionsService.get(params.id);
        if (!vendor) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const deletedVendor = await vendorPaymentTransactionsService.delete(user._id);

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