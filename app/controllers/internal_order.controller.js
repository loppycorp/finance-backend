const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const DefaulService = require("../services/internal_order.service");
const order_typeService = require("../services/order_type.service");
const controlling_areaService = require("../services/controlling_area.service");
const company_codeService = require("../services/company.service");
const profit_centerService = require("../services/profit_center.service");
const currencyService = require("../services/currency.service");
const { createSchema, updateSchema, } = require("../helpers/validations/internal_order.validation");

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

    // validate order
    const ordercode = await DefaulService.getByCode(body.header.order);
    if (ordercode) {
      return res.status(400).send({
        status: 'error',
        message: lang.t('order already exists')
      });
    }
    // validate order_type
    const order_typecode = await order_typeService.get(body.header.order_type);
    if (!order_typecode) {
      return {
        status: false,
        message: lang.t('order_type.err.not_exists')
      };
    }
    // validate controlling_area
    const controlling_areacode = await controlling_areaService.get(body.header.controlling_area);
    if (!controlling_areacode) {
      return {
        status: false,
        message: lang.t('controlling_area.err.not_exists')
      };
    }
    // validate company_code
    const company_code = await company_codeService.get(body.assignments.company_code);
    if (!company_code) {
      return {
        status: false,
        message: lang.t('company_code.err.not_exists')
      };
    }
    // validate profit_center
    const profit_centercode = await profit_centerService.get(body.assignments.profit_center);
    if (!profit_centercode) {
      return {
        status: false,
        message: lang.t('profit_center.err.not_exists')
      };
    }
    // validate currency
    const currencycode = await currencyService.get(body.control_data.control_data.currency);
    if (!currencycode) {
      return {
        status: false,
        message: lang.t('currency.err.not_exists')
      };
    }

    const defaulService = await DefaulService.create(body);

    return res.status(200).send({
      status: "success",
      message: lang.t("internal_order.suc.create"),
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
      message: lang.t("internal_order.suc..search"),
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

    const defaulService = await DefaulService.get(params.id);
    if (!defaulService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("internal_order.err.not_exists"),
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

    const updated_defaulService = await DefaulService.update(
      defaulService._id,
      body
    );

    return res.status(200).send({
      status: "success",
      message: lang.t("internal_order.suc.update"),
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
        message: lang.t("internal_order.err.not_exists"),
      });
    }

    const deleted_defaulService = await DefaulService.delete(defaulService._id);

    return res.status(200).send({
      status: "success",
      message: lang.t("internal_order.suc.delete"),
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
