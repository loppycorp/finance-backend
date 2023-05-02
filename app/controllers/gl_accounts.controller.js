const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const { paramsSchema } = require('../helpers/validations/common.validation');
const gl_accounts_service = require('../services/gl_accounts.service');
const { createSchema, updateSchema } = require('../helpers/validations/gl_accounts.validation');

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
        const gl_accounts = await gl_accounts_service.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.create'),
            data: gl_accounts
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

        const { data, total } = await gl_accounts_service.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.search'),
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

        const gl_accounts = await gl_accounts_service.get(params.id);
        if (!gl_accounts) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('gl_accounts.err.not_exists')
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

        const updated_gl_accounts = await gl_accounts_service.update(gl_accounts._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.update'),
            data: updated_gl_accounts
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

        const gl_accounts = await gl_accounts_service.get(params.id);
        if (!gl_accounts) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('gl_accounts.err.not_exists')
            });
        }

        const deleted_gl_accounts = await gl_accounts_service.delete(gl_accounts._id); 

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.delete'),
            data: deleted_gl_accounts
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
