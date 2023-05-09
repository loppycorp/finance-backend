require('dotenv').config();
const fieldstatusgroup = require('../controllers/field_status_group.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new profit-center record
    app.post(process.env.BASE_URL + '/field-status-groups', fieldstatusgroup.create);

    // List available profit-center records
    app.get(process.env.BASE_URL + '/field-status-groups', pagination.setAttributes, fieldstatusgroup.search);

    // View profit-center record
    app.get(process.env.BASE_URL + '/field-status-groups/:id', fieldstatusgroup.read);

    // Edit profit-center record
    app.put(process.env.BASE_URL + '/field-status-groups/:id', fieldstatusgroup.update);

    // Delete profit-center record
    app.delete(process.env.BASE_URL + '/field-status-groups/:id', fieldstatusgroup.delete);
};