const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const ReverseService = require("../services/reverse_accrual_document.service");
const CompanyService = require("../services/company.service");
const {
  createSchema,
  updateSchema,
} = require("../helpers/validations/reverse_accrual_document.validation");

exports.create = async (req, res) => {
  try {
    logger.info(req.path);

    const body = req.body;

    const validationBody = createSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
      res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationBody.error.details,
      });
      return false;
    }
    // validate company_code_id
    const companyCode = await CompanyService.get(body.header.company_code);
    if (!companyCode) {
      return {
        status: false,
        message: lang.t('company_code.err.not_exists')
      };
    }
    const reverse = await ReverseService.create(body);

    res.status(200).send({
      status: "success",
      message: lang.t("reverse.suc.create"),
      data: reverse,
    });
  } catch (err) {
    logger.error(req.path);
    logger.error(err);

    res.status(500).send({
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

    const { data, total } = await ReverseService.getAll(query);

    res.status(200).send({
      status: "success",
      message: lang.t("reverse.suc.search"),
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

    res.status(500).send({
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
      res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationParams.error.details,
      });
      return false;
    }

    const reverse = await ReverseService.get(params.id);
    if (!reverse) {
      res.status(400).send({
        status: "error",
        message: lang.t("reverse.err.not_exists"),
      });
    }

    const validationBody = updateSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
      res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationBody.error.details,
      });
      return false;
    }

    const updated_reverse = await ReverseService.update(reverse._id, body);

    res.status(200).send({
      status: "success",
      message: lang.t("reverse.suc.update"),
      data: updated_reverse,
    });
  } catch (err) {
    logger.error(req.path);
    logger.error(err);

    res.status(500).send({
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
      res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationParams.error.details,
      });
      return false;
    }

    const reverse = await ReverseService.get(params.id);
    if (!reverse) {
      res.status(400).send({
        status: "error",
        message: lang.t("reverse.err.not_exists"),
      });
    }

    const deleted_reverse = await ReverseService.delete(reverse._id);

    res.status(200).send({
      status: "success",
      message: lang.t("reverse.suc.delete"),
      data: deleted_reverse,
    });
  } catch (err) {
    logger.error(req.path);
    logger.error(err);

    res.status(500).send({
      status: "error",
      message: utilities.getMessage(err),
    });
  }
};
