import dotenv from 'dotenv';

const result = dotenv.config()

/*
if (result.error) {
    console.log('Error Initializing env : %s', result.error);
    throw result.error
}
*/

console.log("Env initialized");