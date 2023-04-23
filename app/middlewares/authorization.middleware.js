const { logger } = require('../middlewares/logging.middleware')
const lang = require('../helpers/lang.helper');
const jwt = require('jsonwebtoken');

exports.validateToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        res.status(403).send({
            'status': 'error',
            'message': lang.t('auth.err.not_exists')
        });
    }

    const bearer = bearerHeader.split(' ');
    let bearerToken = bearerHeader;

    if (bearer.length > 1)
        bearerToken = bearer[1];

    try {
        const jwtPayload = jwt.verify(bearerToken, process.env.JWT_KEY);
        if (!jwtPayload) {
            res.status(403).send({
                'status': 'error',
                'message': lang.t('auth.err.invalid')
            });
        }

        req.auth = jwtPayload;
        next();
    } catch (err) {
        logger.error(req.path);
        logger.error(err);

        res.status(403).send({
            'status': 'error',
            'message': `Auth Error: ${err.message}`
        });
    }
};