const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const { paramsSchema } = require('../helpers/validations/common.validation');
const primary_cost_element_service = require('../services/primary_cost_element.service');
const { createSchema, updateSchema } = require('../helpers/validations/primary_cost_element.validation');

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
        const prmry_cst_elmt = await primary_cost_element_service.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('primary_cost_element.suc.create'),
            data: prmry_cst_elmt
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

        const { data, total } = await primary_cost_element_service.getAll(query);

        res.status(200).send({
            status: 'success',
            message: lang.t('primary_cost_element.suc.search'),
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

        const prmry_cst_elmt = await primary_cost_element_service.get(params.id);
        if (!prmry_cst_elmt) {
            res.status(400).send({
                status: 'error',
                message: lang.t('primary_cost_element.err.not_exists')
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

        const updated_prmry_cst_elmt = await primary_cost_element_service.update(prmry_cst_elmt._id, body);

        res.status(200).send({
            status: 'success',
            message: lang.t('primary_cost_element.suc.update'),
            data: updated_prmry_cst_elmt
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

        const prmry_cst_elmt = await primary_cost_element_service.get(params.id);
        if (!prmry_cst_elmt) {
            res.status(400).send({
                status: 'error',
                message: lang.t('prmry_cst_elmt.err.not_exists')
            });
        }

        const deleted_prmry_cst_elm = await primary_cost_element_service.delete(prmry_cst_elmt._id); 

        res.status(200).send({
            status: 'success',
            message: lang.t('prmry_cst_elm.suc.delete'),
            data: deleted_prmry_cst_elm
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
