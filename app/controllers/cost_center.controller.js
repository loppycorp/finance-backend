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
    const ctrlingArea = await ctrlingAreaService.get(body.controlling_area_id);
    if (!ctrlingArea) {
        return {
            status: false,
            message: lang.t('ctrling_area.err.not_exists')
        };
    }
    
    // Validate user_responsible_id
    const userUserRes = await userService.get(body.basic_data.user_responsible_id);
    if (!userUserRes) {
        return {
            status: false,
            message: lang.t('profit_center.err.not_exists_user')
        };
    }
    
    // Validate person_responsible_id
    const userPerRes = await userService.get(body.basic_data.person_responsible_id);
    if (!userPerRes) {
        return {
            status: false,
            message: lang.t('profit_center.err.not_exists_per')
        };
    }

    // Validate department_id
    const department = await departmentService.get(body.basic_data.department_id);
    if (!department) {
        return {
            status: false,
            message: lang.t('department.err.not_exists')
        };
    }
    
    // Validate cost_ctr_category_id
    const cstCtrCat = await cstCtrCatService.get(body.basic_data.cost_ctr_category_id);
    if (!cstCtrCat) {
        return {
            status: false,
            message: lang.t('cost_center_category.err.not_exists')
        };
    }
    
    // Validate hierarchy_area_id
    const hierarcyArea = await hierarcyAreaService.get(body.basic_data.hierarchy_area_id);
    if (!hierarcyArea) {
        return {
            status: false,
            message: lang.t('hierarcy_area.err.not_exists')
        };
    }
    
    // Validate company_id
    const company = await companyService.get(body.basic_data.company_id);
    if (!company) {
        return {
            status: 'error',
            message: lang.t('company.err.not_exists')
        };
    }
    
    // Validate currency
    const currency = await currencytService.get(body.currency_id);
    if (!currency) {
        return {
            status: 'error',
            message: lang.t('currency.err.not_exists')
        };
    }
    
    // Validate profit_center_id
    const profitCenter = await profitCenterService.get(body.basic_data.profit_center_id);
    if (!profitCenter) {
        return {
            status: 'error',
            message: lang.t('profit_center.err.not_exists')
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

        const costCenter = await costCenterSerrvice.create(body);

        res.status(200).send({
            status: 'success',
            message:lang.t('cost_center.suc.create'),
            data: costCenter
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

        const costCenter = await costCenterSerrvice.get(params.id);
        if (!costCenter) {
            res.status(400).send({
                status: 'error',
                message:lang.t('cost_center.err.not_exists')
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

        const updatedCostCenter = await costCenterSerrvice.update(costCenter._id, body);

        res.status(200).send({
            status: 'success',
            message:lang.t('cost_center.suc.update'),
            data: updatedCostCenter
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

        const costCenter = await costCenterSerrvice.get(params.id);
        if (!costCenter) {
            res.status(400).send({
                status: 'error',
                message:lang.t('cost_center.err.not_exists')
            });
        }

        res.status(200).send({
            status: 'success',
            message:lang.t('cost_center.suc.read'),
            data: costCenter
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

        const { data, total } = await costCenterSerrvice.getAll(query);

        res.status(200).send({
            status: 'success',
            message:lang.t('cost_center.suc.search'),
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

        const costCenter = await costCenterSerrvice.get(params.id);
        if (!costCenter) {
            res.status(400).send({
                status: 'error',
                message:lang.t('cost_center.err.not_exists')
            });
        }

        const deletedCostCenter = await costCenterSerrvice.delete(costCenter._id); 

        res.status(200).send({
            status: 'success',
            message:lang.t('cost_center.suc.delete'),
            data: deletedCostCenter
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