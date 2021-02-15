import opentelemetry from '@opentelemetry/api'
import {LogLevel} from '@opentelemetry/core'
import {NodeTracerProvider} from '@opentelemetry/node'
import {registerInstrumentations} from '@opentelemetry/instrumentation'
import {JaegerExporter} from '@opentelemetry/exporter-jaeger'
import {SimpleSpanProcessor, BatchSpanProcessor, ConsoleSpanExporter} from '@opentelemetry/tracing'

//opentelemetry.diag.setLogger(new opentelemetry.DiagConsoleLogger());
//opentelemetry.diag.setLogLevel(opentelemetry.DiagLogLevel.DEBUG);

const provider = new NodeTracerProvider ({
    logLevel: LogLevel.DEBUG
});

registerInstrumentations({
    tracerProvider: provider
});



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

const exporter = new JaegerExporter(options);
const consoleExporter = new ConsoleSpanExporter();

provider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));
provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();

console.log("tracing initialized");

