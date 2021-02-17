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

# Also See

* [Java Opentelemetry Tempo](https://github.com/mnadeem/boot-opentelemetry-tempo)