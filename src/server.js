import { tracer } from './tracing';
import { register, measureRequestDuration } from './monitoring'

import cors from 'cors'
import opentelemetry from '@opentelemetry/api'
import express from 'express';

const PORT = process.env.PORT || 5555;

const app = express();
app.use(express.json());
app.use(cors());
app.use(measureRequestDuration);

/** 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
**/

// Setup server to Prometheus scrapes:
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        res.status(500).end(ex);
    }
});

app.get('/health', (req, res) => {
    //const span = tracer.startSpan('op');
    //const ctx = span.context();
    //span.setAttribute('key', 'value');

    //console.log('TraceId is : ' + ctx.traceId);
    //span.end();
    return res.status(200).send({ message: "Health is good" });
});

app.listen(PORT, () => {
    console.log('App is listening for requests on port %d', PORT);
});

console.log("Server initialized");