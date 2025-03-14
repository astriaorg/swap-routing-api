# Swap Routing API Helm Chart

This chart deploys the Swap Routing API service on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+

## Installing the Chart

To install the chart with the release name `swap-routing-api`:

```bash
helm install swap-routing-api ./charts
```

## Configuration

The following table lists the configurable parameters of the chart and their default values.

| Parameter                  | Description                                   | Default                          |
|----------------------------|-----------------------------------------------|----------------------------------|
| `global.replicaCount`      | Number of replicas                            | `1`                              |
| `global.useTTY`            | Use TTY logging instead of JSON               | `false`                          |
| `images.api.repo`          | API container image repository                | `ghcr.io/astriaorg/swap-routing-api` |
| `images.api.tag`           | API container image tag                       | `0.1.0`                          |
| `images.api.pullPolicy`    | API container pull policy                     | `IfNotPresent`                   |
| `config.rpcEndpoint`       | RPC endpoint for blockchain access            | `https://rpc.flame.astria.org`   |
| `config.logLevel`          | Logging level                                 | `info`                           |
| `ingress.enabled`          | Enable ingress                                | `false`                          |
| `ports.api`                | Port for the API service                      | `5001`                           |

## Building the Docker Image

To build and push the Docker image:

```bash
docker build -t ghcr.io/astriaorg/swap-routing-api:latest .
docker push ghcr.io/astriaorg/swap-routing-api:latest
```
