const { logger } = require("../middlewares/logging.middleware");

const lang = require("../helpers/lang.helper");
const utilities = require("../helpers/utilities.helper");

// const { paramsSchema } = require("../helpers/validations/common.validation");
// const { createSchema } = require("../helpers/validations/gl_account_document_header.validation");

exports.create = async (req, res) => {
    try {
        logger.info(req.path);

        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.created"),
            data: data,
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

exports.read = async (req, res) => {
    try {
        logger.info(req.path);
        
        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.read"),
            data: data,
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
        
        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.updated"),
            data: data,
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
        
        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.deleted"),
            data: data,
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
        
        return res.status(200).send({
            status: "success",
            message: lang.t("document_data.suc.search"),
            data: data,
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
