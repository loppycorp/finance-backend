require('dotenv').config();
const cstCtr = require('../controllers/cost_center.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new cost centers record
    app.post(process.env.BASE_URL + '/cost-centers', cstCtr.create);

    // List available cost centers records
    app.get(process.env.BASE_URL + '/cost-centers', pagination.setAttributes, cstCtr.search);

    // View cost centers record
    app.get(process.env.BASE_URL + '/cost-centers/:id', cstCtr.read);

    // Edit cost centers record
    app.put(process.env.BASE_URL + '/cost-centers/:id', cstCtr.update);

    // Delete cost centers record
    app.delete(process.env.BASE_URL + '/cost-centers/:id', cstCtr.delete);
}