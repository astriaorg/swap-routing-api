_default:
  @just --list

format:
  npm run format
alias f := format

lint-md:
  docker run --rm -v $PWD:/workdir davidanson/markdownlint-cli2:v0.8.1 \
    "**/*.md" \
    "#node_modules" \
    "#codebase.md"

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

# deploy via gcloud build
[group('infra')]
deploy-cloudbuild:
  gcloud builds submit --config cloudbuild.yaml src

# deploy via gcloud functions deploy command
[group('infra')]
deploy:
  gcloud functions deploy get-quote \
    --entry-point=getQuote \
    --trigger-http \
    --runtime nodejs22 \
    --region=us-west2 \
    --allow-unauthenticated

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
