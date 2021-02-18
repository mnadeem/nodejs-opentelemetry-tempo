# Project Demonstrating Observability For NodeJs Applications

This is a project demonstrating Observability using :

* [Prometheus](https://prometheus.io/) for monitoring and alerting
* [Loki](https://grafana.com/oss/loki/) for Distributed Logging
* [Tempo](https://grafana.com/oss/tempo/) for Distributed Tracing
* [Grafan](https://grafana.com/) for visualization

And basically integrates the following

* [Opentelemetry](https://opentelemetry.io/)
* [Grafan Tempo](https://grafana.com/oss/tempo/) Which internally uses [Jaeger](https://www.jaegertracing.io/)
* [NodeJs Application](https://nodejs.org/en/)

And basically it demonstrate the best practices for :

* Logging : Using Log4js
* ES6 : Using Babel
* Metrics : Using Promclient
* Seperating configuration
* Containerization 

# Running

## In Docker

````bash
docker-compose up --build
````

Access the endpoint

![](docs/img/access-endpoint.png)

View the log and trace in grafana

![](docs/img/logging-tracing.png)


Get the trace information Using Jaeger

![](docs/img/jaeger-tracing.png)

View the metrics in prometheus

![](docs/img/prometheus-metrics.png)

View prometheus metrics in Grafana

![](docs/img/grafana-prometheus.png)


## In Command prompt

Create **.env** file in root folder, refer [this](https://github.com/open-telemetry/opentelemetry-js/blob/v0.16.0/packages/opentelemetry-exporter-jaeger/src/jaeger.ts) for more details on environment variables.

````
LOG_FILE_NAME=nodejs-opentelemetry-tempo.log
OTEL_SERVICE_NAME=nodejs-opentelemetry-tempo
OTEL_EXPORTER_JAEGER_ENDPOINT=http://localhost:14268/api/traces
````

Create Network

````bash
docker network create docker-tempo
````

Start tempo

`ABSOLUTE_PATH_OF_PROJECT = E:\githubRepos\nodejs-opentelemetry-tempo`

````bash
docker run -d --rm -p 6831:6831/udp -p 6832:6832/udp -p 9411:9411 -p 55680:55680 -p 3100:3100 -p 14250:14250 -p 14268:14268 --name tempo -v ${ABSOLUTE_PATH_OF_PROJECT}\etc\tempo-local.yaml:/etc/tempo.yaml --network docker-tempo  grafana/tempo:latest --config.file=/etc/tempo.yaml
````

Start tempo query

````bash
docker run -d --rm -p 16686:16686 --name tempo-query -v ${ABSOLUTE_PATH_OF_PROJECT}\etc\tempo-query.yaml:/etc/tempo-query.yaml  --network docker-tempo  grafana/tempo-query:latest  --grpc-storage-plugin.configuration-file=/etc/tempo-query.yaml
````

````bash
npm install
````

````bash
npm run dev
````

# Also See

* [Java Opentelemetry Tempo](https://github.com/mnadeem/boot-opentelemetry-tempo)