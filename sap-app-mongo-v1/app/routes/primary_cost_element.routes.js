require('dotenv').config();
const primary_cost_element = require('../controllers/primary_cost_element.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new primary cost element
    app.post(process.env.BASE_URL + '/primary-cost-element', primary_cost_element.create);
    // Edit primary cost element record
    app.put(process.env.BASE_URL + '/primary-cost-element/:id', primary_cost_element.update);
    // Delete primary_cost_element record
    app.delete(process.env.BASE_URL + '/primary-cost-element/:id', primary_cost_element.delete);

};