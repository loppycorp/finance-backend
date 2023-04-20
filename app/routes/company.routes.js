require('dotenv').config();
const company = require('../controllers/company.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new company record
    app.post(process.env.BASE_URL + '/company', company.create);

    // List available company records
    app.get(process.env.BASE_URL + '/company', pagination.setAttributes, company.search);

    // View company record
    app.get(process.env.BASE_URL + '/company/:id', company.read);

    // Edit company record
    app.put(process.env.BASE_URL + '/company/:id', company.update);

    // Delete company record
    app.delete(process.env.BASE_URL + '/company/:id', company.delete);
};