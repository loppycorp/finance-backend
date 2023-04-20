const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const userService = require('../services/user.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/user.validation');

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

        const user = await userService.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.create'),
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

        const user = await userService.get(params.id);
        if (!user) {
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

        const updateUser = await userService.update(user._id, body);

        res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.update'),
            data: updateUser
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

        const user = await userService.get(params.id);
        if (!user) {
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

        const { data, total } = await userService.getAll(query);

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

        const user = await userService.get(params.id);
        if (!user) {
            res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }

        const deletedUser = await userService.delete(user._id); 

        res.status(200).send({
            status: 'success',
            message: lang.t('user.suc.delete'),
            data: deletedUser
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