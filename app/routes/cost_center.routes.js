require('dotenv').config();
const cstCtr = require('../controllers/cost_center.controller');
const auth = require('../middlewares/authorization.middleware');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new cost centers record
    app.post(process.env.BASE_URL + '/cost-centers', auth.validateToken, cstCtr.create);

    // List available cost centers records
    app.get(process.env.BASE_URL + '/cost-centers', auth.validateToken, pagination.setAttributes, cstCtr.search);

    // View cost centers record
    app.get(process.env.BASE_URL + '/cost-centers/:id', auth.validateToken, cstCtr.read);

    // Edit cost centers record
    app.put(process.env.BASE_URL + '/cost-centers/:id', auth.validateToken, cstCtr.update);

    // Delete cost centers record
    app.delete(process.env.BASE_URL + '/cost-centers/:id', auth.validateToken, cstCtr.delete);
}