# CLAUDE.md - Coding Assistant Reference

## Build Commands
- Build: `npm run build` or `just b`
- Start Express server in dev mode: `npm run dev` or `just run` (uses nodemon & ts-node)
- Start Express server in prod mode: `npm run start`
- Lint: `npm run lint` or `just l`
- Format: `npm run format` or `just f`
- Test: `npm run test` or `just t`
- Run single test: `npm test -- -t "test name pattern"`
- Deploy to Kubernetes: `just deploy [tag]`

## Code Style Guidelines
- **Imports**: Named exports preferred, organized by external libraries first
- **Types**: Strong TypeScript typing with interfaces in types.ts
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Error Handling**: Try/catch with structured logging via winston
- Files should always end in a new line!
- **Project Structure**:
  - `/src`: Main code
    - `/providers`: External service integrations
    - `/utils`: Helper functions
    - `/vendor`: Third-party dependencies (Uniswap smart-order-router)

## Code Patterns
- Use winston logger for structured logging
- Return typed responses with consistent error structures
- Prefer async/await over raw promises
- Modular organization with clear separation of concerns

## Express App Structure
- `src/app.ts` - Express app setup with middleware
- `src/server.ts` - Server entry point
- `src/getQuote.ts` - Quote endpoint handler
- `GET /get-quote` - Main API endpoint for token swap quotes

## Kubernetes Deployment
- `chart/` - Helm chart for Kubernetes deployment
- `Dockerfile` - Container definition for the API
- `kind-cluster-config.yml` - Configuration for local kind cluster

### Kubernetes Commands
- Build Docker image: `just docker-build [tag]`
- Push Docker image: `just docker-push [tag]`
- Build and push: `just docker-build-push [tag]`
- Deploy to Kubernetes: `just deploy [tag]`
- Install/upgrade Helm chart: `just helm-deploy [name] [namespace]`
- Uninstall Helm chart: `just helm-uninstall [name] [namespace]`
- Get pods: `just get-pods [namespace]`
- Get logs: `just get-logs [pod] [namespace]`
- Port forward: `just port-forward [port] [namespace]`

### Local Development with kind
- Setup local environment: `just setup-local-env [tag]`
- Create kind cluster: `just create-kind-cluster`
- Delete kind cluster: `just delete-kind-cluster`
- Load image to kind: `just kind-load-image [tag]`