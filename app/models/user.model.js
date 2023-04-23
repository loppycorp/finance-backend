const mongoose = require('mongoose');

const STATUS_ACTIVE = 'ACTIVE';
const STATUS_INACTIVE = 'INACTIVE';
const STATUS_DELETED = 'DELETED';

const USER_ROLE_ADMIN = 'ADMIN';
const USER_ROLE_USER = 'USER';

const userSchema = new mongoose.Schema({
    first_name: { type: String, trim: true, required: true },
    last_name:  { type: String, trim: true, required: true },
    email:  { type: String, trim: true, required: true },
    username:  { type: String, trim: true, required: true },
    hash_password: { type: String, trim: true, required: true },
    role:  { type: String, trim: true, default: USER_ROLE_ADMIN, required: true },
    access: [{ type: String, trim: true, required: false }],
    status:  { type: String, default: STATUS_ACTIVE, required: true },
    date_created: { type: Date, default: () => new Date(), required: true },
    date_updated: { type: Date,  default: () => new Date(), required: true }
});

module.exports = mongoose.model('user', userSchema);

module.exports.STATUS_ACTIVE = STATUS_ACTIVE;
module.exports.STATUS_INACTIVE = STATUS_INACTIVE;
module.exports.STATUS_DELETED = STATUS_DELETED;

module.exports.USER_ROLE_ADMIN = USER_ROLE_ADMIN;
module.exports.USER_ROLE_USER = USER_ROLE_USER;