require('dotenv').config();
const ctrlingArea = require('../controllers/controlling_area.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new controlling area record
    app.post(process.env.BASE_URL + '/controlling-areas', ctrlingArea.create);

    // List available department records
    app.get(process.env.BASE_URL + '/controlling-areas', pagination.setAttributes, ctrlingArea.search);

    // View controlling area record
    app.get(process.env.BASE_URL + '/controlling-areas/:id', ctrlingArea.read);

    // Edit controlling area record
    app.put(process.env.BASE_URL + '/controlling-areas/:id', ctrlingArea.update);

    // Delete controlling area record
    app.delete(process.env.BASE_URL + '/controlling-areas/:id', ctrlingArea.delete);
};