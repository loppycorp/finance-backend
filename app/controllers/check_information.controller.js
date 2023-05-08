const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const DefaultService = require("../services/check_information.service");
const companyService = require("../services/company.service");
const {
  createSchema,
  updateSchema,
} = require("../helpers/validations/check_information.validation");

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

    // Validate company_id
    // const company = await companyService.get(body.basic_data.company_id);
    // if (!company) {
    //   return {
    //     status: false,
    //     message: lang.t("company.err.not_exists"),
    //   };
    // }

    const defaultService = await DefaultService.create(body);

    return res.status(200).send({
      status: "success",
      message: lang.t("check_information.suc.create"),
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
      message: lang.t("check_information.suc.search"),
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
        message: lang.t("check_information.err.not_exists"),
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
      message: lang.t("check_information.suc.update"),
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
        message: lang.t("check_information.err.not_exists"),
      });
    }

    const deleted_defaultService = await DefaultService.delete(
      defaultService._id
    );

    return res.status(200).send({
      status: "success",
      message: lang.t("check_information.suc.delete"),
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
