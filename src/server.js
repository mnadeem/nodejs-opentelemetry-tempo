import env from './env';
import {connectLogger} from './log_config';
import log4js from 'log4js';
import {addCorsHeaders } from './cors'
import { tracer, addTraceId} from './tracing';
import { measureRequestDuration, registerPromMetrics } from './monitoring';
import {context, getSpan } from '@opentelemetry/api';

import cors from 'cors'
import express from 'express';

const logger = log4js.getLogger("server");
logger.level = "debug";

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
    
    const childSpan = tracer.startSpan('doSomeWorkInNewSpan', {
        parentSpan, attributes: { 'code.function' : 'doSomeWorkInNewSpan' }
    });
    childSpan.setAttribute('code.filepath', "test");
    doSomeHeavyWork();
    doSomeWorkInNewNestedSpan(childSpan);
    childSpan.end();
}

const doSomeWorkInNewNestedSpan = (parentSpan) => {
    const childSpan = tracer.startSpan('doSomeWorkInNewNestedSpan', {
        parentSpan, attributes: { 'code.function' : 'doSomeWorkInNewNestedSpan' }
    });
    childSpan.setAttribute('code.filepath', "test2");
    //Do some work
    doSomeHeavyWork();
    childSpan.end();
}

const doSomeHeavyWork = () => {
    for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
        // empty
    }
} 

app.listen(PORT, () => {
    logger.debug('App is listening for requests on port %d', PORT);
});

logger.debug("Server initialized");