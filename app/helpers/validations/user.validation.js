const Joi = require('joi');
const User = require('../../models/user.model');

const LIMIT_DEFAULT_CHAR = 128;

const defaultSchema = Joi.object({
    first_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    last_name: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    email: Joi.string().email().required().max(LIMIT_DEFAULT_CHAR),
    username: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    password: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    role: Joi.string().trim().required().valid(User.USER_ROLE_ADMIN, User.USER_ROLE_USER),
    access: Joi.array().items(Joi.string().trim()).min(1),
});

const authSchema = Joi.object({
    username: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR),
    password: Joi.string().trim().required().max(LIMIT_DEFAULT_CHAR)
});


module.exports = {
    createSchema: defaultSchema,
    updateSchema: defaultSchema,
    authSchema
};