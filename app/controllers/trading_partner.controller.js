const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const tradingPartnerService = require('../services/trading_partner.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/trading_partner.validation');

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

        const tradingPartner = await tradingPartnerService.create(body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('trading_partner.suc.create'),
            data: tradingPartner
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

        const tradingPartner = await tradingPartnerService.get(params.id);
        if (!tradingPartner) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('trading_partner.err.not_exists')
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

        const updateTradingPartner = await tradingPartnerService.update(tradingPartner._id, body);

        return res.status(200).send({
            status: 'success',
            message: lang.t('profit_ctr_group.suc.update'),
            data: updateTradingPartner
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

        const tradingPartner = await tradingPartnerService.get(params.id);
        if (!tradingPartner) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('trading_partner.err.not_exists')
            });
        }

        return res.status(200).send({
            status: 'success',
            message: lang.t('trading_partner.suc.read'),
            data: profitCtrGroup
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

        const { data, total } = await tradingPartnerService.getAll(query);

        return res.status(200).send({
            status: 'success',
            message: lang.t('trading_partner.suc.search'),
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

        const tradingPartner = await tradingPartnerService.get(params.id);
        if (!tradingPartner) {
            return res.status(400).send({
                status: 'error',
                message: lang.t('profit_ctr_group.err.not_exists')
            });
        }

        const deleteTradingPartner = await tradingPartnerService.delete(profitCtrGroup._id);

        return res.status(200).send({
            status: 'success',
            message: lang.t('profit_ctr_group.suc.delete'),
            data: deleteTradingPartnerq
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