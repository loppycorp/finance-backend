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
    const ctrlingArea = await ctrlingAreaService.get(body.header.controlling_area);
    if (!ctrlingArea) {
        return {
            status: false,
            message: lang.t('ctrling_area.err.not_exists')
        };
    }

    // validate user_responsible_id
    const getBodyUserRes = body.basic_data.basic_data.user_responsible;
    if (getBodyUserRes != null) {
        const userUserRes = await userService.get(getBodyUserRes);
        if (!userUserRes) {
            return {
                status: false,
                message: lang.t('profit_center.err.not_exists_user')
            };
        }
    }

    // validate department_id
    const getBodyDepartment = body.basic_data.basic_data.department;
    if (getBodyUserRes != null) {
        const department = await departmentService.get(getBodyDepartment);
        if (!department) {
            return {
                status: false,
                message: lang.t('department.err.not_exists')
            };
        }
    }

    // validate profit_ctr_group_id
    const profitCtrGroup = await profitCtrGroupService.get(body.basic_data.basic_data.profit_ctr_group);
    if (!profitCtrGroup) {
        return {
            status: false,
            message: lang.t('profit_ctr_group.err.not_exists')
        };
    }

    // validate segment_id
    const segment = await segmentService.get(body.basic_data.basic_data.segment);
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
            return res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });

        }

        // validate profit_center_code
        const profitCode = await profitCenterService.getByCode(body.basic_data.description.profit_center_code);
        console.log(profitCode);
        if (profitCode) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('Profit Center already exists')
            });
        }

        const auth = req.auth;
        const user = await userService.get(auth._id);
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }
        body.created_by = user.username;
        body.updated_by = user.username;

        const createdProfitCenter = await profitCenterService.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.create'),
            data: createdProfitCenter
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

        }

        // validate profit_center_code
        const profitCode = await profitCenterService.getByCode(body.basic_data.description.profit_center_code, params.id);
        if (profitCode) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('Profit Center already exists')
            });
        }

        const profitCenter = await profitCenterService.get(params.id);
        if (!profitCenter) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('profit_center.err.not_exists')
            });
        }

        const validate = await this.validate(body);
        if (!validate.status) {
            return res.status(400).send({
                status: 'error',
                message: validate.message,
                error: validate.error
            });

        }

        const auth = req.auth;
        const user = await userService.get(auth._id);
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('user.err.not_exists')
            });
        }
        body.updated_by = user.username;


        const updatedProfitCenter = await profitCenterService.update(profitCenter._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.update'),
            data: updatedProfitCenter

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

exports.get = async (req, res) => {
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

        const profitCenter = await profitCenterService.get(params.id);
        if (!profitCenter) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('profit_center.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.read'),
            data: profitCenter
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

        const { data, total } = await profitCenterService.getAll(query);

        return res.status(200).send({
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

        const profitCenter = await profitCenterService.delete(params.id);
        if (!profitCenter) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('profit_center.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('profit_center.suc.delete'),
            data: {}
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