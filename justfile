_default:
  @just --list

format:
  npm run format
alias f := format

lint-md:
  docker run --rm -v $PWD:/workdir davidanson/markdownlint-cli2:v0.8.1 \
    "**/*.md" \
    "#node_modules" \
    "#codebase.md" \
    "#CLAUDE.md"

lint:
  npm run lint
  just lint-md

alias l := lint

test:
  npm run test
alias t := test

run:
  npm run dev

build:
  npm run build
alias b := build

# authenticate with gcloud using a service account
[group('infra')]
gcloud-auth saname sakeypath:
  gcloud auth activate-service-account {{saname}} --key-file={{sakeypath}}

# Build and push Docker image
[group('k8s')]
docker-build tag="local":
  docker build -t ghcr.io/astriaorg/swap-routing-api:{{tag}} .

# Push Docker image to registry
[group('k8s')]
docker-push tag="latest":
  docker push ghcr.io/astriaorg/swap-routing-api:{{tag}}

# Build and push in one command
[group('k8s')]
docker-build-push tag="latest":
  just docker-build {{tag}}
  just docker-push {{tag}}

# Install or upgrade the Helm chart
[group('k8s')]
helm-deploy name="swap-routing-api" namespace="default" values="":
  #!/bin/bash
  if [ -n "{{values}}" ]; then
    helm upgrade --install {{name}} ./chart --namespace {{namespace}} --create-namespace --values {{values}}
  else
    helm upgrade --install {{name}} ./chart --namespace {{namespace}} --create-namespace
  fi

# Uninstall the Helm chart
[group('k8s')]
helm-uninstall name="swap-routing-api" namespace="default":
  helm uninstall {{name}} --namespace {{namespace}}

# Create a kind cluster for local development
[group('k8s')]
create-kind-cluster:
  kind create cluster --name swap-routing-api --config ./kind-cluster-config.yml

# Delete the kind cluster
[group('k8s')]
delete-kind-cluster:
  kind delete cluster --name swap-routing-api

# Load Docker image into kind cluster
[group('k8s')]
kind-load-image tag="latest":
  kind load docker-image ghcr.io/astriaorg/swap-routing-api:{{tag}} --name swap-routing-api

# Get pods for the deployment
[group('k8s')]
get-pods namespace="default":
  kubectl get pods -n {{namespace}} -l app=swap-routing-api

# Get logs for the deployment
[group('k8s')]
get-logs pod="" namespace="default":
  #!/bin/bash
  if [ -z "{{pod}}" ]; then
    POD=$(kubectl get pods -n {{namespace}} -l app=swap-routing-api -o jsonpath="{.items[0].metadata.name}")
    kubectl logs -f -n {{namespace}} $POD
  else
    kubectl logs -f -n {{namespace}} {{pod}}
  fi

# Port forward to access the service locally
[group('k8s')]
port-forward port="5001" namespace="default":
  kubectl port-forward -n {{namespace}} svc/swap-routing-api-service {{port}}:{{port}}

# Test the API through ingress
[group('k8s')]
test-api:
  @echo "Testing API at http://swap-api.localdev.me/get-quote with parameters"
  curl -v "http://swap-api.localdev.me/get-quote?chainId=253368190&tokenInAddress=0x61B7794B6A0Cc383B367c327B91E5Ba85915a071&tokenInDecimals=18&tokenInSymbol=tia&tokenOutAddress=0x3f65144F387f6545bF4B19a1B39C94231E1c849F&tokenOutDecimals=6&tokenOutSymbol=usdc&amount=300000&type=exactOut"

# Deploy to Kubernetes
[group('infra')]
deploy tag="latest":
  just docker-build-push {{tag}}
  just helm-deploy

# Setup local development environment with kind
[group('k8s')]
setup-local-env tag="local":
  just create-kind-cluster
  # Install NGINX Ingress Controller
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
  # Wait for ingress controller to be ready
  kubectl wait --namespace ingress-nginx \
    --for=condition=ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=90s
  just docker-build {{tag}}
  just kind-load-image {{tag}}
  just helm-deploy swap-routing-api default ./chart/values/local.yaml

# compacts contents of json file
[group('utils')]
compact-json filepath:
  cat {{filepath}} | jq -c

# encodes a file as base64
[group('utils')]
encode-base64 filepath:
  base64 -i {{filepath}}

# generate codebase.md that is useful to feed to LLMs
[group('utils')]
ai-digest:
  npx ai-digest -i src --show-output-files

# copy .env.example to .env.local
[group('utils')]
cp-env:
  cp .env.example .env.local
