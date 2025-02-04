import { Protocol } from "@uniswap/router-sdk";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { Pool } from "@uniswap/v3-sdk";

import { GetQuoteResult, V3PoolInRoute } from "../types";
import { routeAmountsToString, SwapRoute } from "../vendor/smart-order-router";

export function transformSwapRouteToGetQuoteResult(
  type: "exactIn" | "exactOut",
  amount: CurrencyAmount<Currency>,
  {
    quote,
    quoteGasAdjusted,
    route,
    estimatedGasUsed,
    estimatedGasUsedQuoteToken,
    estimatedGasUsedUSD,
    gasPriceWei,
    methodParameters,
    blockNumber,
  }: SwapRoute,
): GetQuoteResult {
  const routeResponse: Array<V3PoolInRoute[]> = [];

  for (const subRoute of route) {
    const { amount, quote, tokenPath } = subRoute;

    const pools =
      subRoute.protocol === Protocol.V2
        ? subRoute.route.pairs
        : subRoute.route.pools;
    const curRoute: V3PoolInRoute[] = [];
    for (let i = 0; i < pools.length; i++) {
      const nextPool = pools[i] as Pool;
      const tokenIn = tokenPath[i];
      const tokenOut = tokenPath[i + 1];

      let edgeAmountIn = undefined;
      if (i === 0) {
        edgeAmountIn =
          type === "exactIn"
            ? amount.quotient.toString()
            : quote.quotient.toString();
      }

      let edgeAmountOut = undefined;
      if (i === pools.length - 1) {
        edgeAmountOut =
          type === "exactIn"
            ? quote.quotient.toString()
            : amount.quotient.toString();
      }

      // if (Object.hasOwn(nextPool, "sqrtRatioX96")) {
      curRoute.push({
        type: "v3-pool",
        tokenIn: {
          chainId: tokenIn.chainId,
          decimals: tokenIn.decimals,
          address: tokenIn.address,
          symbol: tokenIn.symbol,
        },
        tokenOut: {
          chainId: tokenOut.chainId,
          decimals: tokenOut.decimals,
          address: tokenOut.address,
          symbol: tokenOut.symbol,
        },
        fee: nextPool.fee.toString(),
        liquidity: nextPool.liquidity.toString(),
        sqrtRatioX96: nextPool.sqrtRatioX96.toString(),
        tickCurrent: nextPool.tickCurrent.toString(),
        amountIn: edgeAmountIn,
        amountOut: edgeAmountOut,
      });
    }

    routeResponse.push(curRoute);
  }

  let result: GetQuoteResult;
  try {
    result = {
      methodParameters,
      blockNumber: blockNumber.toString(),
      amount: amount.quotient.toString(),
      amountDecimals: amount.toExact(),
      quote: quote.quotient.toString(),
      quoteDecimals: quote.toExact(),
      quoteGasAdjusted: quoteGasAdjusted.quotient.toString(),
      quoteGasAdjustedDecimals: quoteGasAdjusted.toExact(),
      gasUseEstimateQuote: estimatedGasUsedQuoteToken.quotient.toString(),
      gasUseEstimateQuoteDecimals: estimatedGasUsedQuoteToken.toExact(),
      gasUseEstimate: estimatedGasUsed.toString(),
      gasUseEstimateUSD: estimatedGasUsedUSD.toExact(),
      gasPriceWei: gasPriceWei.toString(),
      route: routeResponse,
      routeString: routeAmountsToString(route),
    };
  } catch {
    throw new Error("Failed to transform swap route to quote result");
  }

  return result;
}
