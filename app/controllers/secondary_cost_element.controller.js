const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const DefaulService = require("../services/secondary_cost_element.service");
const controlling_area_service = require("../services/controlling_area.service");
const cost_element_service = require("../services/cost_element_category.service");
const { createSchema, updateSchema, } = require("../helpers/validations/secondary_cost_element.validation");

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
    const code = await DefaulService.getByCode(body.header.cost_element_code);
    if (code) {
      return res.status(400).send({
        status: 'error',
        message: lang.t('Secondary Cost Element already exists')
      });
    }
    // validate controlling_area
    const controlling_area = await controlling_area_service.get(body.header.controlling_area_code);
    if (!controlling_area) {
      return {
        status: false,
        message: lang.t('controlling_area.err.not_exists')
      };
    }
    // validate cost_element_category
    const cost_element_category = await cost_element_service.get(body.basic_data.basic_data.cost_element_category);
    if (!cost_element_category) {
      return {
        status: false,
        message: lang.t('cost_element_category.err.not_exists')
      };
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

    const defaulService = await DefaulService.create(body);

    return res.status(200).send({
      status: "success",
      message: lang.t("secondary_cost_element.suc.create"),
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


exports.search = async (req, res) => {
  try {
    logger.info(req.path);

    const query = req.query;
    const pagination = query.pagination;
    const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

    const { data, total } = await DefaulService.getAll(query);

    return res.status(200).send({
      status: "success",
      message: lang.t("secondary_cost_element.suc..search"),
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
    }

    const defaulService = await DefaulService.get(params.id);
    if (!defaulService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("secondary_cost_element.err.not_exists"),
      });
    }

    const validationBody = updateSchema.validate(body, { abortEarly: false });
    if (validationBody.error) {
      return res.status(400).send({
        status: "error",
        message: lang.t("global.err.validation_failed"),
        error: validationBody.error.details,
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

    // validate
    const code = await DefaulService.getByCode(body.header.cost_element_code, params.id);
    if (code) {
      return res.status(400).send({
        status: 'error',
        message: lang.t('Secondary Cost Element already exists')
      });
    }

    const updated_defaulService = await DefaulService.update(defaulService._id, body);

    return res.status(200).send({
      status: "success",
      message: lang.t("secondary_cost_element.suc.update"),
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

    const defaulService = await DefaulService.get(params.id);
    if (!defaulService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("secondary_cost_element.err.not_exists"),
      });
    }

    const deleted_defaulService = await DefaulService.delete(defaulService._id);

    return res.status(200).send({
      status: "success",
      message: lang.t("secondary_cost_element.suc.delete"),
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
