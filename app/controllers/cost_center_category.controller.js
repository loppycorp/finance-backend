const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const cstCtrCatService = require('../services/cost_center_category.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/cost_center_catergory.validation');

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

        const cstCtrCat = await cstCtrCatService.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('cost_center_category.suc.create'),
            data: cstCtrCat
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

        const cstCtrCat = await cstCtrCatService.get(params.id);
        if (!cstCtrCat) {
            res.status(400).send({
                status: 'error',
                message: lang.t('cost_center_category.err.not_exists')
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

        const updatedDepartment = await cstCtrCatService.update(cstCtrCat._id, body);

        res.status(200).send({
            status: 'success',
            message: lang.t('cost_center_category.suc.update'),
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

        const cstCtrCat = await cstCtrCatService.get(params.id);
        if (!cstCtrCat) {
            res.status(400).send({
                status: 'error',
                message: lang.t('cost_center_category.err.not_exists')
            });
        }

        res.status(200).send({
            status: 'success',
            message: lang.t('cost_center_category.suc.read'),
            data: cstCtrCat
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

        const { data, total } = await cstCtrCatService.getAll(query);

        res.status(200).send({
            status: 'success',
            message: lang.t('cost_center_category.suc.search'),
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

        const cstCtrCat = await cstCtrCatService.get(params.id);
        if (!cstCtrCat) {
            res.status(400).send({
                status: 'error',
                message: lang.t('cost_center_category.err.not_exists')
            });
        }

        const deletedDepartment = await cstCtrCatService.delete(cstCtrCat._id); 

        res.status(200).send({
            status: 'success',
            message: lang.t('cost_center_category.suc.delete'),
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