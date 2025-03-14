import { Request, Response } from "express";
import { Token, CurrencyAmount, TradeType } from "@uniswap/sdk-core";
import { Protocol } from "@uniswap/router-sdk";
import { ethers } from "ethers";

import { AlphaRouter, ChainId, SwapRoute } from "./vendor/smart-order-router";
import { V2NullProvider } from "./providers/v2/v2-null-provider";

import { logger, transformSwapRouteToGetQuoteResult } from "./utils";
import { GetQuoteParams } from "./types";

export const getQuoteHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Validate method
    if (req.method !== "GET") {
      res.status(405).send({ error: "Method not allowed" });
      return;
    }

    // TODO - validate query params
    const getQuoteParams: GetQuoteParams = {
      chainId: Number(req.query.chainId) as ChainId,
      tokenInAddress: String(req.query.tokenInAddress),
      tokenInDecimals: Number(req.query.tokenInDecimals),
      tokenInSymbol: String(req.query.tokenInSymbol),
      tokenOutAddress: String(req.query.tokenOutAddress),
      tokenOutDecimals: Number(req.query.tokenOutDecimals),
      tokenOutSymbol: String(req.query.tokenOutSymbol),
      amount: String(req.query.amount),
      type: String(req.query.type) as "exactIn" | "exactOut",
    };
    console.log(getQuoteParams);
    const {
      chainId,
      tokenInAddress,
      tokenInDecimals,
      tokenInSymbol,
      tokenOutAddress,
      tokenOutDecimals,
      tokenOutSymbol,
      amount,
      type,
    } = getQuoteParams;
    const tokenIn = new Token(
      chainId,
      tokenInAddress,
      tokenInDecimals,
      tokenInSymbol,
    );
    const tokenOut = new Token(
      chainId,
      tokenOutAddress,
      tokenOutDecimals,
      tokenOutSymbol,
    );

    const baseCurrency = type === "exactIn" ? tokenIn : tokenOut;
    const quoteCurrency = type === "exactIn" ? tokenOut : tokenIn;

    const amountInOut = CurrencyAmount.fromRawAmount(baseCurrency, amount);

    // create router and get quote
    const provider = new ethers.providers.JsonRpcProvider(
      // TODO - this value should come from config data structure
      "https://rpc.flame.astria.org",
    );
    const router = new AlphaRouter({
      chainId,
      provider,
      v2PoolProvider: new V2NullProvider(), // no v2 pools
    });

    console.log("amount", amountInOut);
    console.log("tokenOut", tokenOut);

    const swapRoute: SwapRoute | null = await router.route(
      amountInOut,
      quoteCurrency,
      type === "exactIn" ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT,
      /*swapConfig*/ undefined,
      { protocols: [Protocol.V3] },
    );

    console.log("swapRoute", swapRoute);

    if (!swapRoute) {
      res.status(404).send({ error: "Failed to generate client side quote" });
      return;
    }

    const data = transformSwapRouteToGetQuoteResult(
      type,
      amountInOut,
      swapRoute,
    );

    res.json({ data });
  } catch (error) {
    logger.error("Error processing getQuote route", { error });
    res.status(500).send({
      error: "Internal server error",
    });
  }
};
