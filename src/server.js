import env from './env';
import {addCorsHeaders } from './cors'
import { tracer } from './tracing';
import { measureRequestDuration, registerPromMetrics } from './monitoring';
import { context, getSpan, getSpanContext } from '@opentelemetry/api';

import cors from 'cors'
import opentelemetry from '@opentelemetry/api'
import express from 'express';

const PORT = process.env.PORT || 5555;

const app = express();
app.use(express.json());
app.use(cors());
app.use(addCorsHeaders);
app.use(measureRequestDuration);

// Setup server to Prometheus scrapes:
app.get('/metrics', registerPromMetrics);

app.get('/health', (req, res) => {
    const spanContext = getSpanContext(opentelemetry.context.active());

    console.log("TraceId : " + spanContext.traceId);
    const parentSpan = getSpan(opentelemetry.context.active());
    doSomeWorkInNewSpan(parentSpan);

    return res.status(200).send({ message: "Health is good" });
});

const doSomeWorkInNewSpan = (parentSpan) => {
    
    const childSpan = tracer.startSpan('doSomeWorkInNewSpan', {
        parentSpan, attributes: { 'code.function' : 'doSomeWorkInNewSpan' }
    });
    childSpan.setAttribute('code.filepath', "test");
    doSomeWorkInNewNestedSpan(childSpan);
    childSpan.end();
}

const doSomeWorkInNewNestedSpan = (parentSpan) => {
    const childSpan = tracer.startSpan('doSomeWorkInNewNestedSpan', {
        parentSpan, attributes: { 'code.function' : 'doSomeWorkInNewNestedSpan' }
    });
    childSpan.setAttribute('code.filepath', "test");
    //Do some work
    for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
        // empty
    }
    childSpan.end();
}

app.listen(PORT, () => {
    console.log('App is listening for requests on port %d', PORT);
});

console.log("Server initialized");