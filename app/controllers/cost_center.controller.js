const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const costCenterSerrvice = require('../services/cost_center.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/cost_center.validation');
const ctrlingAreaService = require('../services/controlling_area.service');
const userService = require('../services/user.service');
const departmentService = require('../services/department.service');
const cstCtrCatService = require('../services/cost_center_category.service');
const hierarcyAreaService = require('../services/hierarcy_area.service');
const companyService = require('../services/company.service');
const currencytService = require('../services/currency.service');
const profitCenterService = require('../services/profit_center.service');

exports.defaultsearch = async (req, res) => {
    try {
        logger.info(req.path);
        const query = req.query;
        const pagination = query.pagination;
        const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

        const searchTerm = decodeURIComponent(query);

        const { data, total } = await costCenterSerrvice.search(searchTerm, query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('suc.search'),
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

exports.validate = async (body) => {
    const validationBody = createSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
        return {
            status: false,
            message: lang.t('global.err.validation_failed'),
            error: validationBody.error.details
        };
    }

    // Validate controlling_area_id
    const ctrlingArea = await ctrlingAreaService.get(body.header.controlling_area);
    if (!ctrlingArea) {
        return {
            status: false,
            message: lang.t('ctrling_area.err.not_exists')
        };
    }

    // Validate user_responsible_id
    if (body.basic_data.basic_data.user_responsible != null) {
        const userUserRes = await userService.get(body.basic_data.basic_data.user_responsible);
        if (!userUserRes) {
            return {
                status: false,
                message: lang.t('profit_center.err.not_exists_user')
            };
        }
    }

    // Validate department_id
    const department = await departmentService.get(body.basic_data.department);
    if (body.basic_data.department) {
        if (!department) {
            return {
                status: false,
                message: lang.t('department.err.not_exists')
            };
        }
    }

    // Validate cost_ctr_category_id
    const cstCtrCat = await cstCtrCatService.get(body.basic_data.cost_ctr_category);
    if (body.basic_data.cost_ctr_category_id) {
        if (!cstCtrCat) {
            return {
                status: false,
                message: lang.t('cost_center_category.err.not_exists')
            };
        }
    }

    // Validate hierarchy_area_id
    const hierarcyArea = await hierarcyAreaService.get(body.basic_data.hierarchy_area);
    if (body.basic_data.hierarchy_area_id) {
        if (!hierarcyArea) {
            return {
                status: false,
                message: lang.t('hierarcy_area.err.not_exists')
            };
        }
    }
    // Validate company_id
    const company = await companyService.get(body.basic_data.basic_data.company);
    if (!company) {
        return {
            status: false,
            message: lang.t('company.err.not_exists')
        };
    }

    // Validate currency
    const currency = await currencytService.get(body.basic_data.basic_data.currency);
    if (!currency) {
        return {
            status: false,
            message: lang.t('currency.err.not_exists')
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

        // validate cost_center_code
        const costCode = await costCenterSerrvice.getByCode(body.header.cost_center_code);
        if (costCode) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('Cost Center already exists')
            });
        }

        // Validate profit_center_id  
        if (body.basic_data.basic_data.profit_center != null) {
            const profitCenter = await profitCenterService.get(body.basic_data.basic_data.profit_center);
            if (!profitCenter) {
                return res.status(400).send({
                    status: 'error',
                    message: lang.t('profit_center.err.not_exists')
                });
            }
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

        const costCenter = await costCenterSerrvice.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_center.suc.create'),
            data: costCenter
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

        // validate cost_center_code
        const costCode = await costCenterSerrvice.getByCode(body.header.cost_center_code, params.id);
        if (costCode) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('Cost Center already exists')
            });
        }

        const costCenter = await costCenterSerrvice.get(params.id);
        if (!costCenter) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('cost_center.err.not_exists')
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

        const updatedCostCenter = await costCenterSerrvice.update(costCenter._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_center.suc.update'),
            data: updatedCostCenter
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

        const costCenter = await costCenterSerrvice.get(params.id);
        if (!costCenter) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('cost_center.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_center.suc.read'),
            data: costCenter
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

        const { data, total } = await costCenterSerrvice.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_center.suc.search'),
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

        const costCenter = await costCenterSerrvice.get(params.id);
        if (!costCenter) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('cost_center.err.not_exists')
            });
        }

        const deletedCostCenter = await costCenterSerrvice.delete(costCenter._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('cost_center.suc.delete'),
            data: deletedCostCenter
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