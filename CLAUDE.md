# CLAUDE.md - Coding Assistant Reference

## Build Commands
- Build: `npm run build` or `just b`
- Start Express server in dev mode: `npm run dev` or `just run` (uses nodemon & ts-node)
- Start Express server in prod mode: `npm run start`
- Lint: `npm run lint` or `just l`
- Format: `npm run format` or `just f`
- Test: `npm run test` or `just t`
- Run single test: `npm test -- -t "test name pattern"`
- Deploy: `just deploy`

## Code Style Guidelines
- **Imports**: Named exports preferred, organized by external libraries first
- **Types**: Strong TypeScript typing with interfaces in types.ts
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Error Handling**: Try/catch with structured logging via winston
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