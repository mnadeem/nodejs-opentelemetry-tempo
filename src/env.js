import dotenv from 'dotenv';
import log4js from 'log4js';

const result = dotenv.config()

if (result.error) {
    console.log('Error Initializing env : %s', result.error);
    throw result.error
}

console.log("Env initialized");