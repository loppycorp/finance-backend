const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const { paramsSchema } = require('../helpers/validations/common.validation');
const assets_service = require('../services/assets.service');
const { createSchema, updateSchema } = require('../helpers/validations/assets.validation');

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
        const assets = await assets_service.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('assets.suc.create'),
            data: assets
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

        const { data, total } = await assets_service.getAll(query);

        res.status(200).send({
            status: 'success',
            message: lang.t('assets.suc.search'),
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

        const assets = await assets_service.get(params.id);
        if (!assets) {
            res.status(400).send({
                status: 'error',
                message: lang.t('assets.err.not_exists')
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

        const updated_assets = await assets_service.update(assets._id, body);

        res.status(200).send({
            status: 'success',
            message: lang.t('assets.suc.update'),
            data: updated_assets
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

        const assets = await assets_service.get(params.id);
        if (!assets) {
            res.status(400).send({
                status: 'error',
                message: lang.t('assets.err.not_exists')
            });
        }

        const deleted_assets = await assets_service.delete(assets._id); 

        res.status(200).send({
            status: 'success',
            message: lang.t('passets.suc.delete'),
            data: deleted_assets
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
