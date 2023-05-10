<<<<<<< HEAD
const { logger } = require("../middlewares/logging.middleware");
const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");
const { paramsSchema } = require("../helpers/validations/common.validation");
const DefaulService = require("../services/vendor_withholding_tax.service");
const CompanyService = require("../services/company.service");
const VendorService = require("../services/vendor.service");
const { createSchema, updateSchema, } = require("../helpers/validations/vendor_withholding_tax.validation");
=======
const { logger } = require('../middlewares/logging.middleware');
const lang = require('../helpers/lang.helper');
const utilities = require('../helpers/utilities.helper');
const defaultService = require('../services/_vendor_withholding_tax.service');
const { paramsSchema } = require('../helpers/validations/common.validation');
const { createSchema, updateSchema } = require('../helpers/validations/vendor_withholding_tax.validation');

>>>>>>> 4cf72324528aafa6dd9a20e47d7c6587ab534ed8

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

    // validate vendor
    const vendorService = await VendorService.get(body.header.vendor);
    if (!vendorService) {
      return {
        status: false,
        message: lang.t('vendor.err.not_exists')
      };
    }
    //validate company
    const companyService = await CompanyService.get(body.header.company_code);
    if (!companyService) {
      return {
        status: false,
        message: lang.t('company.err.not_exists')
      };
    }
    const defaulService = await DefaulService.create(body);

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

    const defaultService = await DefaulService.get(params.id);
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

    const { data, total } = await DefaulService.getAll(query);

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

    const defaulService = await DefaulService.get(params.id);
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

    const updated_defaulService = await DefaulService.update(
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

    const defaulService = await DefaulService.get(params.id);
    if (!defaulService) {
      return res.status(400).send({
        status: "error",
        message: lang.t("vendor.err.not_exists"),
      });
    }

    const deleted_defaulService = await DefaulService.delete(defaulService._id);

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
