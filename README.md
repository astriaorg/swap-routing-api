# Swap Router API

A Google Cloud Function that provides routing functionality for token swaps.

## Overview

This service exposes an HTTP endpoint that allows users to get the best route
for swapping tokens on a decentralized exchange.

## Getting Started

### Prerequisites

- Node.js 22
- Google Cloud SDK
- TypeScript

### Installation

1. Clone the repository
2. Install dependencies:

```sh
npm install
```

### Environment Variables

- `LOG_LEVEL`: Controls the logging verbosity (default: "info")

## API Reference

### Get Swap Route

Calculate the optimal route for swapping between two tokens.

```txt
GET /getQuote
```

#### Request Parameters

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| tokenIn   | string | Source token address      |
| tokenOut  | string | Destination token address |
| amount    | string | Amount of tokenIn to swap |

#### Response

```typescript
{
  route: string[];          // Array of token addresses in the swap route
  estimatedOutput: string;  // Estimated output amount
  price: string;           // Price impact of the swap
}
```

#### Error Responses

- `400 Bad Request`: Missing required parameters
- `405 Method Not Allowed`: Invalid HTTP method
- `500 Internal Server Error`: Server-side error

## Logging

The service uses Winston for structured logging with JSON format. All logs
include timestamps and are output to the console.

## Development

### Project Structure

```txt
├── index.ts          # Main function handler
└── utils
    └── logger.ts     # Logging configuration
```

### Building

```sh
npm run build
```

### Testing

```sh
npm test
```
