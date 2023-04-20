require('dotenv').config();
const segment = require('../controllers/segment.controller');
const pagination = require('../middlewares/pagination.middleware');

module.exports = (app) => {
    // Create new segment record
    app.post(process.env.BASE_URL + '/segments', segment.create);

    // List available segment records
    app.get(process.env.BASE_URL + '/segments', pagination.setAttributes, segment.search);

    // View segment record
    app.get(process.env.BASE_URL + '/segments/:id', segment.read);

    // Edit segment record
    app.put(process.env.BASE_URL + '/segments/:id', segment.update);

    // Delete segment record
    app.delete(process.env.BASE_URL + '/segments/:id', segment.delete);
};