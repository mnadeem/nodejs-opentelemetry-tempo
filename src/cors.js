import log4js from 'log4js';

const logger = log4js.getLogger("cors");
logger.level = "debug";

export const addCorsHeaders = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
};

logger.debug("Cors initialized");