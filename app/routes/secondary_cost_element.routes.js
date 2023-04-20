require('dotenv').config();
const secondary_cost_element = require('../controllers/secondary_cost_element.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new secondary cost element
    app.post(process.env.BASE_URL + '/secondary-cost-element', secondary_cost_element.create);
    // List available secondary cost element
    app.get(process.env.BASE_URL + '/secondary-cost-element', pagination.setAttributes, secondary_cost_element.search);
    // Edit secondary cost element
    app.put(process.env.BASE_URL + '/secondary-cost-element/:id', secondary_cost_element.update);
    // Delete secondary_cost_element 
    app.delete(process.env.BASE_URL + '/secondary-cost-element/:id', secondary_cost_element.delete);

};