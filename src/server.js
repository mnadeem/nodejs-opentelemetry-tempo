import env from './env';
import {connectLogger} from './log_config';
import log4js from 'log4js';
import {addCorsHeaders } from './cors'
import { tracer, addTraceId} from './tracing';
import { measureRequestDuration, registerPromMetrics } from './monitoring';
import { context, setSpan, getSpan } from '@opentelemetry/api';
import cors from 'cors'
import express from 'express';
import {getFlightById} from './dao';

const logger = log4js.getLogger("server");
logger.level = "trace";

const PORT = process.env.PORT || 5555;

const app = express();

app.use(connectLogger(logger));
app.use(express.json());
app.use(cors());
app.use(addCorsHeaders);
app.use(addTraceId);
app.use(measureRequestDuration);

// Setup server to Prometheus scrapes:
app.get('/metrics', registerPromMetrics);

app.get('/health', (req, res) => {
    const parentSpan = getSpan(context.active());
    doSomeHeavyWork();
    doSomeWorkInNewSpan(parentSpan);

    return res.status(200).send({ message: "Health is good" });
});

const doSomeWorkInNewSpan = (parentSpan) => {

    //const ctx = setSpan(context.active(), parentSpan);
    //const childSpan = tracer.startSpan('doWork', undefined, ctx);
    const childSpan = tracer.startSpan('doSomeWorkInNewSpan', {
        attributes: { 'code.function' : 'doSomeWorkInNewSpan' }
    }, context.active());

    childSpan.setAttribute('code.filepath', "test");
    doSomeHeavyWork(1);
    doSomeWorkInNewNestedSpan(childSpan);
    childSpan.end();
}

const doSomeWorkInNewNestedSpan = (parentSpan) => {

    const ctx = setSpan(context.active(), parentSpan);   
    const childSpan = tracer.startSpan('doSomeWorkInNewNestedSpan', {
        attributes: { 'code.function' : 'doSomeWorkInNewNestedSpan' }
    }, ctx);

    childSpan.setAttribute('code.filepath', "test2");
    //Do some work
    doSomeHeavyWork(1);
    context.with(setSpan(context.active(), childSpan), doSomeWorkInNewNested2Span);
    childSpan.end();
}

const doSomeWorkInNewNested2Span = () => {
    const childSpan = tracer.startSpan('doSomeWorkInNewNested2Span');

    logger.info('doSomeWorkInNewNested2Span  traceId %s:%s', childSpan.context().traceId, childSpan.context().spanId);

    Promise.all([asyncWorkOne(childSpan), asyncWorkTwo(childSpan)])
            .then(results => logger.trace(results))
            .catch(err => {
                logger.error(err);
            }); 

    childSpan.end();
}

function asyncWorkOne(parentSpan) {
    const ctx = setSpan(context.active(), parentSpan);   
    const childSpan = tracer.startSpan('asyncWorkOne', {
        attributes: { 'code.function' : 'asyncWorkOne' }
    }, ctx);

    let promise = new Promise((resolve, reject) => {
        try {
            doSomeHeavyWork(1);
            resolve("promise 1 done!")
            childSpan.end();
        } catch (e) {
            reject(e);
            childSpan.end();
        }
    });
    return promise;
}

function asyncWorkTwo(parentSpan) {
    const ctx = setSpan(context.active(), parentSpan);   
    const childSpan = tracer.startSpan('asyncWorkTwo', {
        attributes: { 'code.function' : 'asyncWorkTwo' }
    }, ctx);

    let promise = new Promise((resolve, reject) => {
        try {
            doSomeHeavyWork(2);
            resolve("promise 2 done!");
            childSpan.end();
        } catch (e) {
            reject(e);
            childSpan.end();
        }
    });
    return promise;
}

const doSomeHeavyWork = (flightId) => {
    getFlightById(flightId);
}

app.listen(PORT, () => {
    logger.debug('App is listening for requests on port %d', PORT);
});

logger.debug("Server initialized");