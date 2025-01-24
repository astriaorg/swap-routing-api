_default:
  @just --list

# copy .env.example to .env.local
cp-env:
  cp .env.example .env.local

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

# generate codebase.md that is useful to feed to LLMs
ai-digest:
   npx ai-digest -i src --show-output-files

# deploy the function as a Google Cloud Run Function
deploy:
   gcloud builds submit --region=us-west2 --config cloudbuild.yaml src
