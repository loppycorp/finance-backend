const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const DefaulService = require("../services/bank_key.service");
const bankCountry_service = require("../services/code_country.service");
// const bank_group_service = require("../services/bank_group.service");
const {
  createSchema,
  updateSchema,
} = require("../helpers/validations/bank_key.validation");

exports.defaultsearch = async (req, res) => {
  try {
    logger.info(req.path);
    const query = req.query;
    const pagination = query.pagination;
    const { pageNum, pageLimit, sortOrder, sortBy } = pagination;

    const searchTerm = decodeURIComponent(query);

    const { data, total } = await DefaulService.search(searchTerm, query);

    return res.status(200).send({
      status: 'success',
      message: lang.t('suc.search'),
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

    // validate profit_center_code
    const code = await DefaulService.getByCode(body.header.bank_key_code);
    if (code) {
      return res.status(400).send({
        status: 'error',
        message: lang.t('bank_key code Element already exists')
      });
    }
    // validate bankCountry
    const bankCountry = await bankCountry_service.
      get(body.header.bank_country);
    if (!bankCountry && bankCountry_service != null) {
      return res.status(400).send({
        'status': 'error',
        'message': lang.t('bankCountry is not exists'),
      });
    }
    // validate bank_group
    // const bank_group = await bank_group_service.
    //   get(body.control_data.bank_group);
    // if (!bank_group && bank_group != null) {
    //   return res.status(400).send({
    //     'status': 'error',
    //     'message': lang.t('bank_group is not exists'),
    //   });
    // }
    const defaulService = await DefaulService.create(body);

    return res.status(200).send({
      status: "success",
      message: lang.t("bank_key.suc.create"),
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

    const defaultService = await DefaulService.get(params.id);
    if (!defaultService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("bank_key.err.not_exists"),
      });
    }

    return res.status(200).send({
      status: "success",
      message: lang.t("bank_key.suc.read"),
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

    const { data, total } = await DefaulService.getAll(query);

    return res.status(200).send({
      status: "success",
      message: lang.t("bank_key.suc.search"),
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
        message: lang.t("bank_key.err.not_exists"),
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
      message: lang.t("bank_key.suc.update"),
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
        message: lang.t("bank_key.err.not_exists"),
      });
    }

    const deleted_defaulService = await DefaulService.delete(defaulService._id);

    return res.status(200).send({
      status: "success",
      message: lang.t("bank_key.suc.delete"),
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
