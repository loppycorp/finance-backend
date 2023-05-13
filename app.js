require("dotenv").config();
require("./config/mongodb.config");

const express = require("express");
const cors = require("cors");
const { logger } = require("./app/middlewares/logging.middleware");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send({
    status: "success",
    message: "Welcome to Asia Fi-Co api",
  });
});
//#################### CODES ####################################
require("./app/routes/codes.routes")(app);

//#################### CHAPTER 1 - Major ####################################
require("./app/routes/user.routes")(app);
require("./app/routes/profit_center.routes")(app);
require("./app/routes/profit_center_group.routes")(app);
require("./app/routes/cost_center_category.routes")(app);
require("./app/routes/cost_center.routes")(app);

//#################### CHAPTER 1 - Minor ####################################
require("./app/routes/segment.routes")(app);
require("./app/routes/department.routes")(app);
require("./app/routes/controlling_area.routes")(app);
require("./app/routes/company.routes")(app);

//#################### CHAPTER 2 - Major ####################################
require("./app/routes/gl_accounts.routes")(app);
require("./app/routes/primary_cost_element.routes")(app);
require("./app/routes/secondary_cost_element.routes")(app);
require("./app/routes/vendor_general_data.routes")(app);
require("./app/routes/vendor_company_code_data.routes")(app);
// require("./app/routes/vendor_withholding_tax.routes")(app);
require("./app/routes/customer_general_data.routes")(app);
require("./app/routes/customer_company_code_data.routes")(app);
require("./app/routes/internal_order.routes")(app);
require("./app/routes/assets.routes")(app);
require("./app/routes/sub_assets.routes")(app);
require("./app/routes/bank_key.routes")(app);
require("./app/routes/house_bank.routes")(app);
require("./app/routes/cheque_lot.routes")(app);

//#################### CHAPTER 2 - Minor ####################################
require("./app/routes/gl_account_group.routes")(app);
require("./app/routes/valuation_group.routes")(app);
require("./app/routes/corporate_group.routes")(app);
require("./app/routes/cost_element_category.routes")(app);

//#################### CHAPTER 3 - Major #####################################
require("./app/routes/accrual_deferral_document.routes")(app);
require("./app/routes/reverse_accrual_document.routes")(app);
require("./app/routes/reverse_document.routes")(app);
require("./app/routes/sample_document.routes")(app);
require("./app/routes/post_document_header.routes")(app);
require("./app/routes/recurring_entry_header.routes")(app);
require("./app/routes/recurring_entry_item.routes")(app);
require("./app/routes/posting_document.routes")(app);
require("./app/routes/document_data.routes")(app);
require("./app/routes/vendor_invoice.routes")(app);

//#################### CHAPTER 5 - Major #####################################
require("./app/routes/customer_invoice_header.routes")(app);
require("./app/routes/bill_exchange_payment_header.routes")(app);
require("./app/routes/check_information.routes.js")(app);

//#################### PRESETS  ####################################
require("./app/routes/posting_key.routes")(app);
require("./app/routes/document_type.routes")(app);
require("./app/routes/order_type.routes")(app);
require("./app/routes/fiscal_period.routes")(app);
require("./app/routes/field_status_group.routes")(app);
require("./app/routes/trading_partner.routes")(app);
require("./app/routes/hierarcy_area.routes")(app);
require("./app/routes/currency.routes")(app);

const port = process.env.APP_PORT || 3200;
app.listen(port, () => logger.info(`Listening on port ${port}`));
