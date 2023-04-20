require('dotenv').config();
require('./config/mongodb.config');

const express = require('express');
const cors = require('cors');
const { logger } = require('./app/middlewares/logging.middleware');

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send({
        'status': 'success',
        'message': 'Welcome to SAP api'
    });
});

require('./app/routes/user.routes')(app);
require('./app/routes/department.routes')(app);
require('./app/routes/controlling_area.routes')(app);
require('./app/routes/segment.routes')(app);
require('./app/routes/profit_center.routes')(app);
require('./app/routes/profit_center_group.routes')(app);
require('./app/routes/company.routes')(app);
require('./app/routes/cost_center_category.routes')(app);
require('./app/routes/hierarcy_area.routes')(app);

const port = process.env.APP_PORT || 3200;
app.listen(port, () => logger.info(`Listening on port ${port}`));