const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.validateCreds = async (username, password) => {
    const user = await User.findOne({ username: username, status: User.STATUS_ACTIVE });
    if (!user) return false;

    const pass = await bcrypt.compare(password, user.hash_password);
    if (!pass) return false;
    
    return user;
};

exports.create = async (data) => {
    data.hash_password = bcrypt.hashSync(data.password, 10);

    const user = await User.create(data);

    if (!user) return false;

    return await this.get(user._id)
};

exports.get = async (id, options = {}) => {
    const filters = { _id: ObjectId(id), status: User.STATUS_ACTIVE };

    if (options.allowed_inactive && options.allowed_inactive == true)
        filters.status = User.STATUS_INACTIVE;

    const user = await User.findOne(filters);

    if (!user) return null;

    return this.mapData(user);
};

exports.update = async (id, data) => {
    data.date_updated = new Date();

    const user = await User.findByIdAndUpdate({ _id: ObjectId(id) }, data);

    if (!user) return false;

    return await this.get(user._id);
};

exports.delete = async (id) => {
    const user = await User.findByIdAndUpdate({ _id: ObjectId(id) }, {
        $set: { status: User.STATUS_INACTIVE }
    });

    if (!user) return false;

    return await this.get(user._id, { allowed_inactive: true });
};

exports.getAll = async (query) => {
    const { pageNum, pageLimit, sortOrderInt, sortBy } = query.pagination;

    const options = { status: User.STATUS_ACTIVE };

    const results = await User.find(options)
        .collation({'locale':'en'}).sort({ [sortBy]: sortOrderInt })
        .skip(pageNum > 0 ? ((pageNum - 1) * pageLimit) : 0)
        .limit(pageLimit);

    const usersData = results.map(o => this.mapData(o));

    const usersTotal = await User.countDocuments(options);

    return { data: usersData, total: usersTotal };
};

exports.storeToken = async (id, token) => {
    const user = await User.findByIdAndUpdate({ _id: ObjectId(id) }, { $set: { token: token } });

    if (!user) return false;

    return await this.get(user._id);
};

exports.verifyToken = async (id, token) => {
    return await User.findOne({ _id: ObjectId(id), token: token });
};

exports.destroyToken = async (id, token) => {
    const user = await User.findByIdAndUpdate({ _id: ObjectId(id) }, { $set: { token: '' } });

    if (!user) return false;

    return await this.get(user._id);
};

exports.mapData = (data) => {
    return {
        _id: data._id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        role: data.role,
        access: data.access,
        status: data.status,
        date_created: data.date_created,
        date_updated: data.date_updated
    };
};