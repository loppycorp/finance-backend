const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const { paramsSchema } = require('../helpers/validations/common.validation');
const internal_order_service = require('../services/internal_order.service');
const { createSchema, updateSchema } = require('../helpers/validations/internal_order.validation');

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
        const internal_order = await internal_order_service.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('internal_order.suc.create'),
            data: internal_order
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

        const { data, total } = await internal_order_service.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('internal_order.suc.search'),
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

        const internal_order = await internal_order_service.get(params.id);
        if (!internal_order) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('internal_order.err.not_exists')
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

        const updated_internal_order = await internal_order_service.update(internal_order._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('internal_order.suc.update'),
            data: updated_internal_order
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

        const internal_order = await internal_order_service.get(params.id);
        if (!internal_order) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('internal_order.err.not_exists')
            });
        }

        const deleted_internal_order = await internal_order_service.delete(internal_order._id); 

        return res.status(200).send({
            status: 'success',
            message: lang.t('pinternal_order.suc.delete'),
            data: deleted_internal_order
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
