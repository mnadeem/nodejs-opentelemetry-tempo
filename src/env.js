import dotenv from 'dotenv';
import log4js from 'log4js';

const logger = log4js.getLogger("env");
logger.level = "debug";

const result = dotenv.config()

if (result.error) {
    logger.error('Error Initializing env : %s', result.error);
    throw result.error
}

logger.debug("Env initialized");