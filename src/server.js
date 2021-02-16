import {addCorsHeaders} from './cors'
import { tracer } from './tracing';
import { measureRequestDuration, registerPromMetrics} from './monitoring';
import { context, getSpan, getSpanContext} from '@opentelemetry/api';

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
    
    //const span = getSpan(opentelemetry.context.active());
    //console.log(span.context().traceId);

    const spanContext = getSpanContext(opentelemetry.context.active());

    console.log("TraceId : " + spanContext.traceId);

    return res.status(200).send({ message: "Health is good" });
});

app.listen(PORT, () => {
    console.log('App is listening for requests on port %d', PORT);
});

console.log("Server initialized");