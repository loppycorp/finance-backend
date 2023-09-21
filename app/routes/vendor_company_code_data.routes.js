require("dotenv").config();
const vendor = require("../controllers/vendor_company_code_data.controller");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new account record
  app.post(process.env.BASE_URL + "/vendors-company-code", vendor.create);

  // List available account records
  app.get(
    process.env.BASE_URL + "/vendors-company-code",
    pagination.setAttributes,
    vendor.search
  );
  //search
  app.get(
    process.env.BASE_URL + "/vendors-company-code-search",
    pagination.setAttributes,
    vendor.defaultsearch
  );
  // View account record
  app.get(process.env.BASE_URL + "/vendors-company-code/:id", vendor.read);

  // Edit account record
  app.put(process.env.BASE_URL + "/vendors-company-code/:id", vendor.update);

  // Delete account record
  app.delete(process.env.BASE_URL + "/vendors-company-code/:id", vendor.delete);
};
