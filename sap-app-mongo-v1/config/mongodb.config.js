require('dotenv').config();

const mongoose = require('mongoose');
const { logger } = require('../app/middlewares/logging.middleware')

const MONGO_USERNAME = process.env.MONGO_DB_USER;
const MONGO_PASSWORD = process.env.MONGO_DB_PASS;
const MONGO_HOSTNAME = process.env.MONGO_DB_HOST;
const MONGO_PORT = process.env.MONGO_DB_PORT;
const MONGO_DB = process.env.MONGO_DB_NAME;
const MONGO_DB_AUTH_DB_NAME = process.env.MONGO_DB_AUTH_DB_NAME;

// let url = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
let url = `mongodb+srv://${MONGO_HOSTNAME}:${MONGO_PASSWORD}@${MONGO_DB}.t9kzhow.mongodb.net/AsiaFiCo?retryWrites=true&w=majority`;


// if (MONGO_USERNAME != '' && MONGO_PASSWORD != '') {
//     url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=${MONGO_DB_AUTH_DB_NAME}`;
// }

mongoose.set("strictQuery", false);
mongoose.connect(url)
    .then(() => logger.info('Connected from MongoDB database...'))
    .catch((err) => logger.info(err));