const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const companyService = require('../services/company.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/company.validation');

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

        const company = await companyService.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('company.suc.create'),
            data: company
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

        const validationBody = updateSchema.validate(body, { abortEarly: false });
        if (validationBody.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationBody.error.details
            });
            return false;
        }

        const validationParams = paramsSchema.validate(params, { abortEarly: false });
        if (validationParams.error) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('global.err.validation_failed'),
                'error': validationParams.error.details
            });
            return false;
        }

        const company = await companyService.get(params.id);
        if (!company) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('company.err.not_exists')
            });
        }

        const updatedDepartment = await companyService.update(company._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('company.suc.update'),
            data: updatedDepartment
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

        const company = await companyService.get(params.id);
        if (!company) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('company.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('company.suc.read'),
            data: company
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

        const { data, total } = await companyService.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('company.suc.search'),
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

        const company = await companyService.get(params.id);
        if (!company) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('company.err.not_exists')
            });
        }

        const deletedDepartment = await companyService.delete(company._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('company.suc.delete'),
            data: deletedDepartment
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