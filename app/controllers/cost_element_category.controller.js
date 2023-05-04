const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const defaultService = require('../services/cost_element_category.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/cost_element_category.validation');


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
        }

        // validate code
        const Code = await defaultService.getByCode(body.code);
        if (Code) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('code already exists')
            });
        }

        // validate name
        const Name = await defaultService.getByName(body.name);
        if (Name) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('name already exists')
            });
        }

        const defaultVariable = await defaultService.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_element_category.suc.create'),
            data: defaultVariable
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

        const defaultVariable = await defaultService.get(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('cost_element_category.err.not_exists')
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

        const updateVendor = await defaultService.update(defaultVariable._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_element_category.suc.update'),
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

        const defaultVariable = await defaultService.get(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('bank.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_element_category.suc.read'),
            data: defaultVariable
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

        const { data, total } = await defaultService.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_element_category.suc.search'),
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

        const defaultVariable = await defaultService.get(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('cost_element_category.err.not_exists')
            });
        }

        const deletedVendor = await defaultService.delete(defaultVariable._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_element_category.suc.delete'),
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