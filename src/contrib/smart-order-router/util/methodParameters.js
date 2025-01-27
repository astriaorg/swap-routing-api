import { MixedRouteSDK, Protocol, SwapRouter, Trade, } from '@uniswap/router-sdk';
import { TradeType } from '@uniswap/sdk-core';
import { Route as V2RouteRaw } from '@uniswap/v2-sdk';
import { Route as V3RouteRaw } from '@uniswap/v3-sdk';
import _ from 'lodash';
import { CurrencyAmount, } from '..';
export function buildTrade(tokenInCurrency, tokenOutCurrency, tradeType, routeAmounts) {
    /// Removed partition because of new mixedRoutes
    const v3RouteAmounts = _.filter(routeAmounts, (routeAmount) => routeAmount.protocol === Protocol.V3);
    const v2RouteAmounts = _.filter(routeAmounts, (routeAmount) => routeAmount.protocol === Protocol.V2);
    const mixedRouteAmounts = _.filter(routeAmounts, (routeAmount) => routeAmount.protocol === Protocol.MIXED);
    const v3Routes = _.map(v3RouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        if (tradeType == TradeType.EXACT_INPUT) {
            const amountCurrency = CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
            const quoteCurrency = CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
            const routeRaw = new V3RouteRaw(route.pools, amountCurrency.currency, quoteCurrency.currency);
            return {
                routev3: routeRaw,
                inputAmount: amountCurrency,
                outputAmount: quoteCurrency,
            };
        }
        else {
            const quoteCurrency = CurrencyAmount.fromFractionalAmount(tokenInCurrency, quote.numerator, quote.denominator);
            const amountCurrency = CurrencyAmount.fromFractionalAmount(tokenOutCurrency, amount.numerator, amount.denominator);
            const routeCurrency = new V3RouteRaw(route.pools, quoteCurrency.currency, amountCurrency.currency);
            return {
                routev3: routeCurrency,
                inputAmount: quoteCurrency,
                outputAmount: amountCurrency,
            };
        }
    });
    const v2Routes = _.map(v2RouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        if (tradeType == TradeType.EXACT_INPUT) {
            const amountCurrency = CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
            const quoteCurrency = CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
            const routeV2SDK = new V2RouteRaw(route.pairs, amountCurrency.currency, quoteCurrency.currency);
            return {
                routev2: routeV2SDK,
                inputAmount: amountCurrency,
                outputAmount: quoteCurrency,
            };
        }
        else {
            const quoteCurrency = CurrencyAmount.fromFractionalAmount(tokenInCurrency, quote.numerator, quote.denominator);
            const amountCurrency = CurrencyAmount.fromFractionalAmount(tokenOutCurrency, amount.numerator, amount.denominator);
            const routeV2SDK = new V2RouteRaw(route.pairs, quoteCurrency.currency, amountCurrency.currency);
            return {
                routev2: routeV2SDK,
                inputAmount: quoteCurrency,
                outputAmount: amountCurrency,
            };
        }
    });
    const mixedRoutes = _.map(mixedRouteAmounts, (routeAmount) => {
        const { route, amount, quote } = routeAmount;
        if (tradeType != TradeType.EXACT_INPUT) {
            throw new Error('Mixed routes are only supported for exact input trades');
        }
        // The route, amount and quote are all in terms of wrapped tokens.
        // When constructing the Trade object the inputAmount/outputAmount must
        // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
        const amountCurrency = CurrencyAmount.fromFractionalAmount(tokenInCurrency, amount.numerator, amount.denominator);
        const quoteCurrency = CurrencyAmount.fromFractionalAmount(tokenOutCurrency, quote.numerator, quote.denominator);
        const routeRaw = new MixedRouteSDK(route.pools, amountCurrency.currency, quoteCurrency.currency);
        return {
            mixedRoute: routeRaw,
            inputAmount: amountCurrency,
            outputAmount: quoteCurrency,
        };
    });
    const trade = new Trade({ v2Routes, v3Routes, mixedRoutes, tradeType });
    return trade;
}
export function buildSwapMethodParameters(trade, swapConfig) {
    const { recipient, slippageTolerance, deadline, inputTokenPermit } = swapConfig;
    return SwapRouter.swapCallParameters(trade, {
        recipient,
        slippageTolerance,
        deadlineOrPreviousBlockhash: deadline,
        inputTokenPermit,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kUGFyYW1ldGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlsL21ldGhvZFBhcmFtZXRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLGFBQWEsRUFDYixRQUFRLEVBQ1IsVUFBVSxFQUNWLEtBQUssR0FDTixNQUFNLHFCQUFxQixDQUFDO0FBQzdCLE9BQU8sRUFBWSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsS0FBSyxJQUFJLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3RELE9BQU8sRUFBb0IsS0FBSyxJQUFJLFVBQVUsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3hFLE9BQU8sQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUV2QixPQUFPLEVBQ0wsY0FBYyxHQU1mLE1BQU0sSUFBSSxDQUFDO0FBRVosTUFBTSxVQUFVLFVBQVUsQ0FDeEIsZUFBeUIsRUFDekIsZ0JBQTBCLEVBQzFCLFNBQXFCLEVBQ3JCLFlBQW1DO0lBRW5DLGdEQUFnRDtJQUNoRCxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUM3QixZQUFZLEVBQ1osQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEVBQUUsQ0FDdEQsQ0FBQztJQUNGLE1BQU0sY0FBYyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQzdCLFlBQVksRUFDWixDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsRUFBRSxDQUN0RCxDQUFDO0lBQ0YsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUNoQyxZQUFZLEVBQ1osQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDLEtBQUssQ0FDekQsQ0FBQztJQUVGLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBUXBCLGNBQXlDLEVBQ3pDLENBQUMsV0FBa0MsRUFBRSxFQUFFO1FBQ3JDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUU3QyxrRUFBa0U7UUFDbEUsdUVBQXVFO1FBQ3ZFLGtHQUFrRztRQUNsRyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQ3RDLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FDeEQsZUFBZSxFQUNmLE1BQU0sQ0FBQyxTQUFTLEVBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQ25CLENBQUM7WUFDRixNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsb0JBQW9CLENBQ3ZELGdCQUFnQixFQUNoQixLQUFLLENBQUMsU0FBUyxFQUNmLEtBQUssQ0FBQyxXQUFXLENBQ2xCLENBQUM7WUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLFVBQVUsQ0FDN0IsS0FBSyxDQUFDLEtBQUssRUFDWCxjQUFjLENBQUMsUUFBUSxFQUN2QixhQUFhLENBQUMsUUFBUSxDQUN2QixDQUFDO1lBRUYsT0FBTztnQkFDTCxPQUFPLEVBQUUsUUFBUTtnQkFDakIsV0FBVyxFQUFFLGNBQWM7Z0JBQzNCLFlBQVksRUFBRSxhQUFhO2FBQzVCLENBQUM7U0FDSDthQUFNO1lBQ0wsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLG9CQUFvQixDQUN2RCxlQUFlLEVBQ2YsS0FBSyxDQUFDLFNBQVMsRUFDZixLQUFLLENBQUMsV0FBVyxDQUNsQixDQUFDO1lBRUYsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLG9CQUFvQixDQUN4RCxnQkFBZ0IsRUFDaEIsTUFBTSxDQUFDLFNBQVMsRUFDaEIsTUFBTSxDQUFDLFdBQVcsQ0FDbkIsQ0FBQztZQUVGLE1BQU0sYUFBYSxHQUFHLElBQUksVUFBVSxDQUNsQyxLQUFLLENBQUMsS0FBSyxFQUNYLGFBQWEsQ0FBQyxRQUFRLEVBQ3RCLGNBQWMsQ0FBQyxRQUFRLENBQ3hCLENBQUM7WUFFRixPQUFPO2dCQUNMLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixXQUFXLEVBQUUsYUFBYTtnQkFDMUIsWUFBWSxFQUFFLGNBQWM7YUFDN0IsQ0FBQztTQUNIO0lBQ0gsQ0FBQyxDQUNGLENBQUM7SUFFRixNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQVFwQixjQUF5QyxFQUN6QyxDQUFDLFdBQWtDLEVBQUUsRUFBRTtRQUNyQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxXQUFXLENBQUM7UUFFN0Msa0VBQWtFO1FBQ2xFLHVFQUF1RTtRQUN2RSxrR0FBa0c7UUFDbEcsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLFdBQVcsRUFBRTtZQUN0QyxNQUFNLGNBQWMsR0FBRyxjQUFjLENBQUMsb0JBQW9CLENBQ3hELGVBQWUsRUFDZixNQUFNLENBQUMsU0FBUyxFQUNoQixNQUFNLENBQUMsV0FBVyxDQUNuQixDQUFDO1lBQ0YsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLG9CQUFvQixDQUN2RCxnQkFBZ0IsRUFDaEIsS0FBSyxDQUFDLFNBQVMsRUFDZixLQUFLLENBQUMsV0FBVyxDQUNsQixDQUFDO1lBRUYsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQy9CLEtBQUssQ0FBQyxLQUFLLEVBQ1gsY0FBYyxDQUFDLFFBQVEsRUFDdkIsYUFBYSxDQUFDLFFBQVEsQ0FDdkIsQ0FBQztZQUVGLE9BQU87Z0JBQ0wsT0FBTyxFQUFFLFVBQVU7Z0JBQ25CLFdBQVcsRUFBRSxjQUFjO2dCQUMzQixZQUFZLEVBQUUsYUFBYTthQUM1QixDQUFDO1NBQ0g7YUFBTTtZQUNMLE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FDdkQsZUFBZSxFQUNmLEtBQUssQ0FBQyxTQUFTLEVBQ2YsS0FBSyxDQUFDLFdBQVcsQ0FDbEIsQ0FBQztZQUVGLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FDeEQsZ0JBQWdCLEVBQ2hCLE1BQU0sQ0FBQyxTQUFTLEVBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQ25CLENBQUM7WUFFRixNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FDL0IsS0FBSyxDQUFDLEtBQUssRUFDWCxhQUFhLENBQUMsUUFBUSxFQUN0QixjQUFjLENBQUMsUUFBUSxDQUN4QixDQUFDO1lBRUYsT0FBTztnQkFDTCxPQUFPLEVBQUUsVUFBVTtnQkFDbkIsV0FBVyxFQUFFLGFBQWE7Z0JBQzFCLFlBQVksRUFBRSxjQUFjO2FBQzdCLENBQUM7U0FDSDtJQUNILENBQUMsQ0FDRixDQUFDO0lBRUYsTUFBTSxXQUFXLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FRdkIsaUJBQStDLEVBQy9DLENBQUMsV0FBcUMsRUFBRSxFQUFFO1FBQ3hDLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLFdBQVcsQ0FBQztRQUU3QyxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQ2Isd0RBQXdELENBQ3pELENBQUM7U0FDSDtRQUVELGtFQUFrRTtRQUNsRSx1RUFBdUU7UUFDdkUsa0dBQWtHO1FBQ2xHLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FDeEQsZUFBZSxFQUNmLE1BQU0sQ0FBQyxTQUFTLEVBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQ25CLENBQUM7UUFDRixNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsb0JBQW9CLENBQ3ZELGdCQUFnQixFQUNoQixLQUFLLENBQUMsU0FBUyxFQUNmLEtBQUssQ0FBQyxXQUFXLENBQ2xCLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLGFBQWEsQ0FDaEMsS0FBSyxDQUFDLEtBQUssRUFDWCxjQUFjLENBQUMsUUFBUSxFQUN2QixhQUFhLENBQUMsUUFBUSxDQUN2QixDQUFDO1FBRUYsT0FBTztZQUNMLFVBQVUsRUFBRSxRQUFRO1lBQ3BCLFdBQVcsRUFBRSxjQUFjO1lBQzNCLFlBQVksRUFBRSxhQUFhO1NBQzVCLENBQUM7SUFDSixDQUFDLENBQ0YsQ0FBQztJQUVGLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUV4RSxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFFRCxNQUFNLFVBQVUseUJBQXlCLENBQ3ZDLEtBQTJDLEVBQzNDLFVBQXVCO0lBRXZCLE1BQU0sRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixFQUFFLEdBQ2hFLFVBQVUsQ0FBQztJQUNiLE9BQU8sVUFBVSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMxQyxTQUFTO1FBQ1QsaUJBQWlCO1FBQ2pCLDJCQUEyQixFQUFFLFFBQVE7UUFDckMsZ0JBQWdCO0tBQ2pCLENBQUMsQ0FBQztBQUNMLENBQUMifQ==
