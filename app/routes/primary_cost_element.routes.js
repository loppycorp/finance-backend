require("dotenv").config();
const primary_cost_element = require("../controllers/primary_cost_element.controller");
const pagination = require("../middlewares/pagination.middleware");

module.exports = (app) => {
  // Create new primary cost element
  app.post(
    process.env.BASE_URL + "/primary-cost-element",
    primary_cost_element.create
  );
  // List available primary cost element
  app.get(
    process.env.BASE_URL + "/primary-cost-element",
    pagination.setAttributes,
    primary_cost_element.search
  );
  // Edit primary cost element
  app.put(
    process.env.BASE_URL + "/primary-cost-element/:id",
    primary_cost_element.update
  );
  // Delete primary_cost_element
  app.delete(
    process.env.BASE_URL + "/primary-cost-element/:id",
    primary_cost_element.delete
  );
};
