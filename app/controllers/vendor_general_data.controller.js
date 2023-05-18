const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const DefaultService = require("../services/vendor_general_data.service");
const CompanyService = require("../services/company.service");
// const VendorAccService = require("../services/vendor_account_group.service");
const CustomerService = require("../services/customer_general_data.service");
const TradingService = require("../services/trading_partner.service");
const AuthorizationService = require("../services/code_authorization.service");
const CorporateService = require("../services/code_corporate_group.service");
const { paramsSchema } = require("../helpers/validations/common.validation");
const { createSchema, updateSchema } = require("../helpers/validations/vendor_general_data.validation");


exports.create = async (req, res) => {
  try {
    logger.info(req.path);

    const body = req.body;

    const validationBody = createSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
      return res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationBody.error.details,
      });
    }
    // validate 
    const code = await DefaultService.getByCode(body.header.vendor_code);
    if (code) {
      return res.status(400).send({
        status: 'error',
        message: lang.t('vendor code already exists')
      });
    }
    // validate company_code
    const company_code = await CompanyService.
      get(body.header.company_code);
    if (!company_code && body.header.company_code != null) {
      return res.status(400).send({
        'status': 'error',
        'message': lang.t('company_code.err.not_exists'),
      });
    }
    // validate account_group
    // const account_group = await VendorAccService.
    //   get(body.header.account_group);
    // if (!account_group && body.header.account_group != null) {
    //   return res.status(400).send({
    //     'status': 'error',
    //     'message': lang.t('account_group.err.not_exists'),
    //   });
    // }
    // validate profit_center_code
    const customer = await CustomerService.
      get(body.control_data.account_control.customer);
    if (!customer && body.control_data.account_control.customer != null) {
      return res.status(400).send({
        'status': 'error',
        'message': lang.t('customer.err.not_exists'),
      });
    }
    // validate trading_partner
    const trading_partner = await TradingService.
      get(body.control_data.account_control.trading_partner);
    if (!trading_partner && body.control_data.account_control.trading_partner != null) {
      return res.status(400).send({
        'status': 'error',
        'message': lang.t('trading_partner.err.not_exists'),
      });
    }
    // validate authorization
    const authorization = await AuthorizationService.
      get(body.control_data.account_control.authorization);
    if (!authorization && body.control_data.account_control.authorization != null) {
      return res.status(400).send({
        'status': 'error',
        'message': lang.t('authorization.err.not_exists'),
      });
    }
    // validate profit_center_code
    const corporate_group = await CorporateService.
      get(body.control_data.account_control.corporate_group);
    if (!corporate_group && body.control_data.account_control.corporate_group != null) {
      return res.status(400).send({
        'status': 'error',
        'message': lang.t('corporate_group.err.not_exists'),
      });
    }


    const defaulService = await DefaultService.create(body);

    return res.status(200).send({
      status: "success",
      message: lang.t("vendor.suc.create"),
      data: defaulService,
    });
  } catch (err) {
    logger.error(req.path);
    logger.error(err);

    return res.status(500).send({
      status: "error",
      message: utilities.getMessage(err),
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

    const defaultService = await DefaultService.get(params.id);
    if (!defaultService) {
      return res.status(400).send({
        status: 'error',
        message: lang.t('vendor.err.not_exists')
      });
    }

    return res.status(200).send({
      status: 'success',
      message: lang.t('vendor.suc.read'),
      data: defaultService
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

    const { data, total } = await DefaultService.getAll(query);

    return res.status(200).send({
      status: "success",
      message: lang.t("vendor.suc..search"),
      data: data,
      pagination: {
        page_num: pageNum,
        page_limit: pageLimit,
        page_count: data.length,
        sort_order: sortOrder,
        sort_by: sortBy,
        total_result: total,
      },
    });
  } catch (err) {
    logger.error(req.path);
    logger.error(err);

    return res.status(500).send({
      status: "error",
      message: utilities.getMessage(err),
    });
  }
};

exports.update = async (req, res) => {
  try {
    logger.info(req.path);

    const body = req.body;
    const params = req.params;

    const validationParams = paramsSchema.validate(params, {
      abortEarly: false,
    });
    if (validationParams.error) {
      return res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationParams.error.details,
      });
      return false;
    }

    const defaulService = await DefaultService.get(params.id);
    if (!defaulService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("vendor.err.not_exists"),
      });
    }

    const validationBody = updateSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
      return res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationBody.error.details,
      });
      return false;
    }

    const updated_defaulService = await DefaultService.update(
      defaulService._id,
      body
    );

    return res.status(200).send({
      status: "success",
      message: lang.t("vendor.suc.update"),
      data: updated_defaulService,
    });
  } catch (err) {
    logger.error(req.path);
    logger.error(err);

    return res.status(500).send({
      status: "error",
      message: utilities.getMessage(err),
    });
  }
};
exports.delete = async (req, res) => {
  try {
    logger.info(req.path);

    const params = req.params;

    const validationParams = paramsSchema.validate(params, {
      abortEarly: false,
    });
    if (validationParams.error) {
      return res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationParams.error.details,
      });
      return false;
    }

    const defaulService = await DefaultService.get(params.id);
    if (!defaulService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("vendor.err.not_exists"),
      });
    }

    const deleted_defaulService = await DefaultService.delete(defaulService._id);

    return res.status(200).send({
      status: "success",
      message: lang.t("vendor.suc.delete"),
      data: deleted_defaulService,
    });
  } catch (err) {
    logger.error(req.path);
    logger.error(err);

    return res.status(500).send({
      status: "error",
      message: utilities.getMessage(err),
    });
  }
};
