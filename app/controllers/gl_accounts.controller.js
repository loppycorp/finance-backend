const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const { paramsSchema } = require('../helpers/validations/common.validation');
const gl_accounts_service = require('../services/gl_accounts.service');
const company_code_service = require('../services/company.service');
const account_group_service = require('../services/gl_account_group.service');
const trading_partner_service = require('../services/trading_partner.service');
const account_currency_service = require('../services/currency.service');
const field_status_group_service = require('../services/field_status_group.service');
const { createSchema, updateSchema } = require('../helpers/validations/gl_accounts.validation');


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

        // validate
        const gl_account_code = await gl_accounts_service.getByCode(body.header.gl_account_code);
        if (gl_account_code) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('G/L Account Code is already exists'),
            });

        }
        // validate company_code
        const company_code = await company_code_service.
            get(body.header.company_code);
        if (!company_code && body.header.company_code != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('company_code is not exists'),
            });
        }
        // validate account_group
        const account_group = await account_group_service.
            get(body.type_description.control_in_chart_of_accounts.account_group);
        if (!account_group && body.type_description.control_in_chart_of_accounts.account_group != null) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('account_group is not exists'),
            });
        }
        // validate trading_partner
        const trading_partner = await trading_partner_service.
            get(body.type_description.consolidation_data_in_chart_of_accounts.trading_partner);
        if (!trading_partner &&
            body.type_description.consolidation_data_in_chart_of_accounts.trading_partner != null
        ) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('trading_partner is not exists'),
            });
        }
        // validate account_currency
        const account_currency = await account_currency_service.
            get(body.control_data.account_control_in_company_code.account_currency);
        if (!account_currency && body.type_description.consolidation_data_in_chart_of_accounts.trading_partner != null
        ) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('account_currency is not exists'),
            });
        }
        // validate field_status_group
        const field_status_group = await field_status_group_service
            .get(body.create_bank_interest.control_of_document_creation_in_company_code.field_status_group);
        if (!field_status_group && body.type_description.consolidation_data_in_chart_of_accounts.trading_partner != null
        ) {
            return res.status(400).send({
                'status': 'error',
                'message': lang.t('field_status_group is not exists'),
            });
        }

        const gl_accounts = await gl_accounts_service.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.create'),
            data: gl_accounts
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

        const { data, total } = await gl_accounts_service.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.search'),
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

        const gl_accounts = await gl_accounts_service.get(params.id);
        if (!gl_accounts) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('gl_accounts.err.not_exists')
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

        const updated_gl_accounts = await gl_accounts_service.update(gl_accounts._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.update'),
            data: updated_gl_accounts
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

        const gl_accounts = await gl_accounts_service.get(params.id);
        if (!gl_accounts) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('gl_accounts.err.not_exists')
            });
        }

        const deleted_gl_accounts = await gl_accounts_service.delete(gl_accounts._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('gl_accounts.suc.delete'),
            data: deleted_gl_accounts
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
