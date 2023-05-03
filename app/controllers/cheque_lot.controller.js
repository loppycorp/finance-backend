const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const defaultService = require('../services/cheque_lot.service');
const companyService = require('../services/company.service');
const glAccountService = require('../services/gl_accounts.service');
const houseBankService = require('../services/house_bank.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/cheque_lot.validation');


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

        // validate company_code
        const company = await companyService.get(body.paying_company_code);
        if (!company) {
            return {
                status: false,
                message: lang.t('company.err.not_exists')
            };
        }

        // validate gl_account_id
        const glAccount = await glAccountService.get(body.gl_account);
        if (!glAccount) {
            return {
                status: false,
                message: lang.t('gl_account.err.not_exists')
            };
        }

        // validate house_bank_id
        const houseBank = await houseBankService.get(body.house_bank);
        if (!houseBank) {
            return {
                status: false,
                message: lang.t('company.err.not_exists')
            };
        }

        // validate bank_key_code
        const lotNumber = await defaultService.getByLotNumber(body.lot_number);
        if (lotNumber) {
            return {
                status: false,
                message: lang.t('lot_number.err.already_exists')
            };

        }


        const defaultVariable = await defaultService.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('house_bank.suc.create'),
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
                message: lang.t('house_bank.err.not_exists')
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
            message: lang.t('_house_bank.suc.update'),
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
                message: lang.t('house_bank.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('house_bank.suc.read'),
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
            message: lang.t('house_bank.suc.search'),
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

        const defaultVariable = await defaultService.get(params.id);
        if (!defaultVariable) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('house_bank.err.not_exists')
            });
        }

        const deletedVendor = await defaultService.delete(bank._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('house_bank.suc.delete'),
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