import opentelemetry from '@opentelemetry/api'
import express from 'express';

const PORT = process.env.PORT || 5555;

const tracer = opentelemetry.trace.getTracer('nodejs-opentelemetry-tempo');

const app = express();
app.use(express.json());
 
app.get('/health', (req, res) => {
    const span = tracer.startSpan('op');
    const ctx = span.context();
    span.setAttribute('key', 'value');
    
    console.log('TraceId is : ' + ctx.traceId);
    span.end();
    return res.status(200).send({message: "Health is good"});
});
 
app.listen(PORT, () => {
    console.log('App is listening for requests on port %d', PORT);
});

console.log("Server initialized");