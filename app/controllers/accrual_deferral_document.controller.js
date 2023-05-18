const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const company_code_service = require("../services/company.service");
const ledgerservice = require("../services/code_ledger_group.service");
const pstkyservice = require("../services/posting_key.service");
const accountservice = require("../services/gl_accounts.service");
const DefaultService = require("../services/accrual_deferral_document.service");

const {
  createSchema,
  updateSchema,
} = require("../helpers/validations/accrual_deferral_document.validation");

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
      return false;
    }
    // validate company_code
    const company_code = await company_code_service.get(body.header.company_code);
    if (!company_code) {
      return {
        status: false,
        message: lang.t('company_code.err.not_exists')
      };
    }
    // validate ledger
    const ledger = await ledgerservice.get(body.header.ledger_group);
    if (!ledger) {
      return {
        status: false,
        message: lang.t('ledger.err.not_exists')
      };
    }
    // pstky
    const pstky = await pstkyservice.get(body.item.pstky);
    if (!pstky) {
      return {
        status: false,
        message: lang.t('posting_key.err.not_exists')
      };
    }
    // validate account
    const account = await accountservice.get(body.item.account);
    if (!account) {
      return {
        status: false,
        message: lang.t('account.err.not_exists')
      };
    }
    // validate company_code
    const ledgerg = await ledgerservice.get(body.data_entry_view.ledger_group);
    if (!ledgerg) {
      return {
        status: false,
        message: lang.t('ledger.err.not_exists')
      };
    }
    const defaultService = await DefaultService.create(body);

    return res.status(200).send({
      status: "success",
      message: lang.t("accrual_deferral_document.suc.create"),
      data: defaultService,
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
exports.search = async (req, res) => {
  try {
    logger.info(req.path);

    const query = req.query;
    const pagination = query.pagination;
    const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

    const { data, total } = await DefaultService.getAll(query);

    return res.status(200).send({
      status: "success",
      message: lang.t("accrual_deferral_document.suc.search"),
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

    const defaultService = await DefaultService.get(params.id);
    if (!defaultService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("accrual_deferral_document.err.not_exists"),
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

    const updated_defaultService = await DefaultService.update(
      defaultService._id,
      body
    );

    return res.status(200).send({
      status: "success",
      message: lang.t("accrual_deferral_document.suc.update"),
      data: updated_defaultService,
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

    const defaultService = await DefaultService.get(params.id);
    if (!defaultService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("accrual_deferral_document.err.not_exists"),
      });
    }

    const deleted_defaultService = await DefaultService.delete(
      defaultService._id
    );

    return res.status(200).send({
      status: "success",
      message: lang.t("accrual_deferral_document.suc.delete"),
      data: deleted_defaultService,
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
