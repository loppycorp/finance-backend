const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const accountGroupService = require('../services/gl_account_group.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/gl_account_group.validation');

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

        const accountGroup = await accountGroupService.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('accountGroup.suc.create'),
            data: accountGroup
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

        const accountGroup = await accountGroupService.get(params.id);
        if (!accountGroup) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('accountGroup.err.not_exists')
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

        const updatedaccountGroup = await accountGroupService.update(accountGroup._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('accountGroup.suc.update'),
            data: updatedaccountGroup
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

        const accountGroup = await accountGroupService.get(params.id);
        if (!accountGroup) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('accountGroup.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('accountGroup.suc.read'),
            data: profitCtrGroup
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

        const { data, total } = await accountGroupService.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('accountGroup.suc.search'),
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

        }

        const accountGroup = await accountGroupService.get(params.id);
        if (!accountGroup) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('accountGroup.err.not_exists')
            });
        }

        const deletedaccountGroup = await accountGroupService.delete(accountGroup._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('accountGroup.suc.delete'),
            data: deletedaccountGroup
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