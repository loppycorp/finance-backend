const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const vendorService = require('../services/vendor_company_code_data.service');
const vendorsService = require('../services/vendor.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/vendor_company_code_data.validation');


exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;

        const validationBody = createSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });
            return false;
        }

            // validate vendor_id
          const vendors = await vendorsService.get(body.company_code_id);
          if (!vendors) {
                 return {
                   status: false,
                   message: lang.t('vendor.err.not_exists')
       };
    }
        const vendor = await vendorService.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.create'),
            data: vendor
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
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
            res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
            return false;
        }

        const vendor = await vendorService.get(params.id);
        if (!vendor) {
            res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const validationBody = updateSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });
            return false;
        }

        const updateVendor = await vendorService.update(vendor._id, body);

        res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.update'),
            data: updateVendor
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
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
            res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
            return false;
        }

        const vendor = await vendorService.get(params.id);
        if (!vendor) {
            res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.read'),
            data: user
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
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

        res.status(200).send({
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

        res.status(500).send({
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
            res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
            return false;
        }

        const vendor = await vendorService.get(params.id);
        if (!vendor) {
            res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const deletedVendor = await vendorService.delete(user._id); 

        res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.delete'),
            data: deletedVendor
        });
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(500).send({
            status: 'error',
            message: utilities.getMessage(err)
        });
    }
};