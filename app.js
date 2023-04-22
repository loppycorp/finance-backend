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
        'message': 'Welcome to Asia Fi-Co api'
    });
});
// CHAPTER 1
require('./app/routes/user.routes')(app);
require('./app/routes/department.routes')(app);
require('./app/routes/controlling_area.routes')(app);
require('./app/routes/segment.routes')(app);
require('./app/routes/profit_center.routes')(app);
require('./app/routes/profit_center_group.routes')(app);
require('./app/routes/company.routes')(app);
require('./app/routes/cost_center_category.routes')(app);
require('./app/routes/hierarcy_area.routes')(app);

// CHAPTER 2 
require('./app/routes/primary_cost_element.routes')(app);
require('./app/routes/secondary_cost_element.routes')(app);
require('./app/routes/vendor.routes')(app);
require('./app/routes/vendor_pymnt_transc.routes')(app);
require('./app/routes/vendor_company_code_data.routes')(app);
require('./app/routes/trading_partner.routes')(app);
require('./app/routes/corporate_group.routes')(app);


const port = process.env.APP_PORT || 3200;
app.listen(port, () => logger.info(`Listening on port ${port}`));