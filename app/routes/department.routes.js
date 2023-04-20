require('dotenv').config();
const department = require('../controllers/department.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new department record
    app.post(process.env.BASE_URL + '/departments', department.create);

    // List available department records
    app.get(process.env.BASE_URL + '/departments', pagination.setAttributes, department.search);

    // View department record
    app.get(process.env.BASE_URL + '/departments/:id', department.read);

    // Edit department record
    app.put(process.env.BASE_URL + '/departments/:id', department.update);

    // Delete department record
    app.delete(process.env.BASE_URL + '/departments/:id', department.delete);
};