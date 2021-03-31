import log4js from 'log4js';
import opentelemetry, { context, getSpan, getSpanContext } from '@opentelemetry/api';
import {NodeTracerProvider} from '@opentelemetry/node'
import {registerInstrumentations} from '@opentelemetry/instrumentation'
import {JaegerExporter} from '@opentelemetry/exporter-jaeger'
import {SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter} from '@opentelemetry/tracing'
import { ExpressInstrumentation } from '@aspecto/opentelemetry-instrumentation-express'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { AwsInstrumentation } from 'opentelemetry-instrumentation-aws-sdk'
import { MssqlInstrumentation } from 'opentelemetry-instrumentation-mssql'

const logger = log4js.getLogger("tracing");
logger.level = "debug";

// Enable OpenTelemetry exporters to export traces to Grafan Tempo.

const tracerProvider = new NodeTracerProvider ();

registerInstrumentations({
    tracerProvider: tracerProvider,
    instrumentations: [
        new ExpressInstrumentation(),
        new HttpInstrumentation(),
        new AwsInstrumentation(),
        new MssqlInstrumentation(),
    ]
});

// Initialize the exporter. 
const options = {
    serviceName: process.env.OTEL_SERVICE_NAME,
    tags: [], // optional
    // You can use the default UDPSender
    //host: 'localhost', // optional
    //port: 6832, // optional
    // OR you can use the HTTPSender as follows
    //14250 : model.proto not working 
    endpoint: process.env.OTEL_EXPORTER_JAEGER_ENDPOINT,
    maxPacketSize: 65000 // optional
}

/**
 * 
 * Configure the span processor to send spans to the exporter
 * The SimpleSpanProcessor does no batching and exports spans
 * immediately when they end. For most production use cases,
 * OpenTelemetry recommends use of the BatchSpanProcessor.
 */
tracerProvider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter(options)));
//tracerProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

/**
 * Registering the provider with the API allows it to be discovered
 * and used by instrumentation libraries. The OpenTelemetry API provides
 * methods to set global SDK implementations, but the default SDK provides
 * a convenience method named `register` which registers same defaults
 * for you.
 *
 * By default the NodeTracerProvider uses Trace Context for propagation
 * and AsyncHooksScopeManager for context management. To learn about
 * customizing this behavior, see API Registration Options below.
 */
// Initialize the OpenTelemetry APIs to use the NodeTracerProvider bindings
tracerProvider.register();

export const tracer = opentelemetry.trace.getTracer(process.env.OTEL_SERVICE_NAME);

export const addTraceId = (req, res, next) => {
    const spanContext = getSpanContext(context.active());
    req.traceId = spanContext && spanContext.traceId;    
    next();
};

logger.debug("tracing initialized for %s sending span to %s", options.serviceName, options.endpoint);
