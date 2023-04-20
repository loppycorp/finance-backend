require('dotenv').config();
const hierarcyArea = require('../controllers/hierarcy_area.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new hierarcy area record
    app.post(process.env.BASE_URL + '/hierarcy-areas', hierarcyArea.create);

    // List available hierarcy area records
    app.get(process.env.BASE_URL + '/hierarcy-areas', pagination.setAttributes, hierarcyArea.search);

    // View hierarcy area record
    app.get(process.env.BASE_URL + '/hierarcy-areas/:id', hierarcyArea.read);

    // Edit hierarcy area record
    app.put(process.env.BASE_URL + '/hierarcy-areas/:id', hierarcyArea.update);

    // Delete hierarcy area record
    app.delete(process.env.BASE_URL + '/hierarcy-areas/:id', hierarcyArea.delete);
}