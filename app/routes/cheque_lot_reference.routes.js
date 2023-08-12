require("dotenv").config();
const defaultController = require("../controllers/cheque_lot_reference.controller");
const auth = require("../middlewares/authorization.middleware");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new cheque-lot-reference
  app.post(
    process.env.BASE_URL + "/cheque-lot-reference",
    auth.validateToken,
    defaultController.create
  );

  // app.get(
  //   process.env.BASE_URL + "/cheque-lot-reference/:id",
  //   auth.validateToken,
  //   defaultController.get
  // );
  // List availablecheque-lot-reference
  app.get(
    process.env.BASE_URL + "/cheque-lot-reference",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.search
  );

  app.get(
    process.env.BASE_URL + "/cheque-lot-reference/:id",
    auth.validateToken,
    pagination.setAttributes,
    defaultController.findAllById
  );
  // Editcheque-lot-reference
  app.put(
    process.env.BASE_URL + "/cheque-lot-reference/:id",
    auth.validateToken,
    defaultController.update
  );
  // Delete cheque-lot-reference
  app.delete(
    process.env.BASE_URL + "/cheque-lot-reference/:id",
    auth.validateToken,
    defaultController.delete
  );
};
