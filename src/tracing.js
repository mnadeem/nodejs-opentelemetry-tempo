import opentelemetry from '@opentelemetry/api'
import {LogLevel} from '@opentelemetry/core'
import {NodeTracerProvider} from '@opentelemetry/node'
import {registerInstrumentations} from '@opentelemetry/instrumentation'
import {JaegerExporter} from '@opentelemetry/exporter-jaeger'
import {SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter} from '@opentelemetry/tracing'

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

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

const options = {
    serviceName: 'nodejs-opentelemetry-tempo',
    tags: [], // optional
    // You can use the default UDPSender
    host: 'localhost', // optional
    port: 14250, // optional
    // OR you can use the HTTPSender as follows
    // endpoint: 'http://localhost:14268/api/traces',
    maxPacketSize: 65000 // optional
}

/**
 * The SimpleSpanProcessor does no batching and exports spans
 * immediately when they end. For most production use cases,
 * OpenTelemetry recommends use of the BatchSpanProcessor.
 */
provider.addSpanProcessor(new BatchSpanProcessor(new JaegerExporter(options)));

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

console.log("tracing initialized");


const tracer =  opentelemetry.trace.getTracer('nodejs-opentelemetry-tempo');



