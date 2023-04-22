require('dotenv').config();
const assets = require('../controllers/assets.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new primary cost element
    app.post(process.env.BASE_URL + '/assets', assets.create);
    // List available primary cost element
    app.get(process.env.BASE_URL + '/assets', pagination.setAttributes, assets.search);
    // Edit primary cost element
    app.put(process.env.BASE_URL + '/assets/:id', assets.update);
    // Delete assets 
    app.delete(process.env.BASE_URL + '/assets/:id', assets.delete);

};