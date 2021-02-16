import log4js from 'log4js';
import opentelemetry from '@opentelemetry/api'
import {LogLevel} from '@opentelemetry/core'
import {NodeTracerProvider} from '@opentelemetry/node'
import {registerInstrumentations} from '@opentelemetry/instrumentation'
import {JaegerExporter} from '@opentelemetry/exporter-jaeger'
import {SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter} from '@opentelemetry/tracing'


const logger = log4js.getLogger("tracing");
logger.level = "debug";

// Enable OpenTelemetry exporters to export traces to Grafan Tempo.
const provider = new NodeTracerProvider ({
    plugins: {
        express: {
          enabled: true,
          path: '@opentelemetry/plugin-express',
        },
        http: {
            enabled: true,
            path: '@opentelemetry/plugin-http',
        },
    },
    logLevel: LogLevel.ERROR,      
});

registerInstrumentations({
    tracerProvider: provider
});

// Initialize the exporter. 
const options = {
    serviceName: 'nodejs-opentelemetry-tempo',
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
provider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter(options)));
//provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

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
provider.register();

export const tracer = opentelemetry.trace.getTracer(process.env.OTEL_SERVICE_NAME);

logger.debug("tracing initialized");
