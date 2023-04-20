const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/profit_center.validation');
const ctrlingAreaService = require('../services/controlling_area.service');
const userService = require('../services/user.service');
const departmentService = require('../services/department.service');
const profitCtrGroupService = require('../services/profit_center_group.service');
const segmentService = require('../services/segment.service');
const profitCenterService = require('../services/profit_center.service');

exports.validate = async (body) => {
    const validationBody = createSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
        return {
            status: false,
            message: lang.t('global.err.validation_failed'),
            error: validationBody.error.details
        };
    }

    // validate controlling_area_id
    const ctrlingArea = await ctrlingAreaService.get(body.controlling_area_id);
    if (!ctrlingArea) {
        return {
            status: false,
            message: lang.t('ctrling_area.err.not_exists')
        };
    }

    // validate user_responsible_id
    const userUserRes = await userService.get(body.basic_data.user_responsible_id);
    if (!userUserRes) {
        return {
            status: false,
            message: lang.t('profit_center.err.not_exists_user')
        };
    }

    // validate person_responsible_id
    const userPerRes = await userService.get(body.basic_data.person_responsible_id);
    if (!userPerRes) {
        return {
            status: false,
            message: lang.t('profit_center.err.not_exists_per')
        };
    }

    // validate department_id
    const department = await departmentService.get(body.basic_data.department_id);
    if (!department) {
        return {
            status: false,
            message: lang.t('department.err.not_exists')
        };
    }

    // validate profit_ctr_group_id
    const profitCtrGroup = await profitCtrGroupService.get(body.basic_data.profit_ctr_group_id);
    if (!profitCtrGroup) {
        return {
            status: false,
            message: lang.t('profit_ctr_group.err.not_exists')
        };
    }
    
    // validate segment_id
    const segment = await segmentService.get(body.basic_data.segment_id);
    if (!segment) {
        return {
            status: false,
            message: lang.t('segment.err.not_exists')
        };
    }
    
    return { status: true };
};

exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        const body = req.body;

        const validate = await this.validate(body);
        if (!validate.status) {
            res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });
            return false;
        }

        const createdProfitCenter = await profitCenterService.create(body);

        res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.create'),
            data: createdProfitCenter
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

        const profitCenter = await profitCenterService.get(params.id);
        if (!profitCenter) {
            res.status(400).send({
                status: 'error',
                message: lang.t('profit_center.err.not_exists')
            });
        }

        const validate = await this.validate(body);
        if (!validate.status) {
            res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });
            return false;
        }

        const updatedProfitCenter = await profitCenterService.update(profitCenter._id, body);

        res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.update'),
            data: updatedProfitCenter
            
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

exports.get = async (req, res) => {
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

        const profitCenter = await profitCenterService.get(params.id);
        if (!profitCenter) {
            res.status(400).send({
                status: 'error',
                message: lang.t('profit_center.err.not_exists')
            });
        }

        res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.read'),
            data: profitCenter
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

        const { data, total } = await profitCenterService.getAll(query);

        res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.search'),
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

        res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.delete'),
            data: {}
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