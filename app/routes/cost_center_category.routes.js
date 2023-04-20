require('dotenv').config();
const cstCtrCat = require('../controllers/cost_center_category.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new cost center catergory record
    app.post(process.env.BASE_URL + '/cost-center-category', cstCtrCat.create);

    // List available cost center catergory records
    app.get(process.env.BASE_URL + '/cost-center-category', pagination.setAttributes, cstCtrCat.search);

    // View cost center catergory record
    app.get(process.env.BASE_URL + '/cost-center-category/:id', cstCtrCat.read);

    // Edit cost center catergory record
    app.put(process.env.BASE_URL + '/cost-center-category/:id', cstCtrCat.update);

    // Delete cost center catergory record
    app.delete(process.env.BASE_URL + '/cost-center-category/:id', cstCtrCat.delete);
}