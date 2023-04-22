const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const fieldstatusgroupService = require('../services/fieldstatusgroup.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/fieldstatusgroup.validation');

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

        const fieldstatusgroup = await fieldstatusgroupService.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('fieldstatusgroup.suc.create'),
            data: fieldstatusgroup
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

        const fieldstatusgroup = await fieldstatusgroupService.get(params.id);
        if (!fieldstatusgroup) {
            res.status(400).send({
                status: 'error',
                message: lang.t('fieldstatusgroup.err.not_exists')
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

        const updatedDepartment = await fieldstatusgroupService.update(fieldstatusgroup._id, body);

        res.status(200).send({
            status: 'success',
            message: lang.t('fieldstatusgroup.suc.update'),
            data: updatedDepartment
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

        const fieldstatusgroup = await fieldstatusgroupService.get(params.id);
        if (!fieldstatusgroup) {
            res.status(400).send({
                status: 'error',
                message: lang.t('fieldstatusgroup.err.not_exists')
            });
        }

        res.status(200).send({
            status: 'success',
            message: lang.t('fieldstatusgroup.suc.read'),
            data: fieldstatusgroup
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

        const { data, total } = await fieldstatusgroupService.getAll(query);

        res.status(200).send({
            status: 'success',
            message: lang.t('fieldstatusgroup.suc.search'),
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

        const fieldstatusgroup = await fieldstatusgroupService.get(params.id);
        if (!fieldstatusgroup) {
            res.status(400).send({
                status: 'error',
                message: lang.t('fieldstatusgroup.err.not_exists')
            });
        }

        const deletedDepartment = await fieldstatusgroupService.delete(fieldstatusgroup._id); 

        res.status(200).send({
            status: 'success',
            message: lang.t('fieldstatusgroup.suc.delete'),
            data: deletedDepartment
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