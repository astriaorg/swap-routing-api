import { HttpFunction } from "@google-cloud/functions-framework";
import { logger } from "./utils/logger";

interface SwapRequest {
  tokenIn: string;
  tokenOut: string;
  amount: string;
}

interface SwapResponse {
  route: string[];
  estimatedOutput: string;
  price: string;
}

export const swapRouter: HttpFunction = async (req, res) => {
  try {
    // set CORS headers for all responses
    res.set("Access-Control-Allow-Origin", "*");

    // handle OPTIONS request for CORS preflight
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
      return;
    }

    if (req.method !== "GET") {
      res.status(405).send({ error: "Method not allowed" });
      return;
    }

    const { tokenIn, tokenOut, amount }: SwapRequest = req.body;

    if (!tokenIn || !tokenOut || !amount) {
      res.status(400).send({
        error: "Missing required parameters: tokenIn, tokenOut, amount",
      });
      return;
    }

    // TODO
    const response: SwapResponse = {
      route: [tokenIn, tokenOut],
      estimatedOutput: "0",
      price: "0",
    };

    logger.info("Swap route calculated", {
      tokenIn,
      tokenOut,
      amount,
    });

    res.status(200).send(response);
  } catch (error) {
    logger.error("Error processing swap route", { error });
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
