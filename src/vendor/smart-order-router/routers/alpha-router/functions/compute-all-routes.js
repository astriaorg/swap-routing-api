import { Pair } from '@uniswap/v2-sdk';
import { Pool } from '@uniswap/v3-sdk';
import { log } from '../../../util/log';
import { routeToString } from '../../../util/routes';
import { MixedRoute, V2Route, V3Route } from '../../router';
export function computeAllV3Routes(tokenIn, tokenOut, pools, maxHops) {
    return computeAllRoutes(tokenIn, tokenOut, (route, tokenIn, tokenOut) => {
        return new V3Route(route, tokenIn, tokenOut);
    }, pools, maxHops);
}
export function computeAllV2Routes(tokenIn, tokenOut, pools, maxHops) {
    return computeAllRoutes(tokenIn, tokenOut, (route, tokenIn, tokenOut) => {
        return new V2Route(route, tokenIn, tokenOut);
    }, pools, maxHops);
}
export function computeAllMixedRoutes(tokenIn, tokenOut, parts, maxHops) {
    const routesRaw = computeAllRoutes(tokenIn, tokenOut, (route, tokenIn, tokenOut) => {
        return new MixedRoute(route, tokenIn, tokenOut);
    }, parts, maxHops);
    /// filter out pure v3 and v2 routes
    return routesRaw.filter((route) => {
        return (!route.pools.every((pool) => pool instanceof Pool) &&
            !route.pools.every((pool) => pool instanceof Pair));
    });
}
export function computeAllRoutes(tokenIn, tokenOut, buildRoute, pools, maxHops) {
    const poolsUsed = Array(pools.length).fill(false);
    const routes = [];
    const computeRoutes = (tokenIn, tokenOut, currentRoute, poolsUsed, _previousTokenOut) => {
        if (currentRoute.length > maxHops) {
            return;
        }
        if (currentRoute.length > 0 &&
            currentRoute[currentRoute.length - 1].involvesToken(tokenOut)) {
            routes.push(buildRoute([...currentRoute], tokenIn, tokenOut));
            return;
        }
        for (let i = 0; i < pools.length; i++) {
            if (poolsUsed[i]) {
                continue;
            }
            const curPool = pools[i];
            const previousTokenOut = _previousTokenOut ? _previousTokenOut : tokenIn;
            if (!curPool.involvesToken(previousTokenOut)) {
                continue;
            }
            const currentTokenOut = curPool.token0.equals(previousTokenOut)
                ? curPool.token1
                : curPool.token0;
            currentRoute.push(curPool);
            poolsUsed[i] = true;
            computeRoutes(tokenIn, tokenOut, currentRoute, poolsUsed, currentTokenOut);
            poolsUsed[i] = false;
            currentRoute.pop();
        }
    };
    computeRoutes(tokenIn, tokenOut, [], poolsUsed);
    log.info({
        routes: routes.map(routeToString),
    }, `Computed ${routes.length} possible routes.`);
    return routes;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcHV0ZS1hbGwtcm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2Z1bmN0aW9ucy9jb21wdXRlLWFsbC1yb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV2QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDeEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUU1RCxNQUFNLFVBQVUsa0JBQWtCLENBQ2hDLE9BQWMsRUFDZCxRQUFlLEVBQ2YsS0FBYSxFQUNiLE9BQWU7SUFFZixPQUFPLGdCQUFnQixDQUNyQixPQUFPLEVBQ1AsUUFBUSxFQUNSLENBQUMsS0FBYSxFQUFFLE9BQWMsRUFBRSxRQUFlLEVBQUUsRUFBRTtRQUNqRCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxFQUNELEtBQUssRUFDTCxPQUFPLENBQ1IsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVUsa0JBQWtCLENBQ2hDLE9BQWMsRUFDZCxRQUFlLEVBQ2YsS0FBYSxFQUNiLE9BQWU7SUFFZixPQUFPLGdCQUFnQixDQUNyQixPQUFPLEVBQ1AsUUFBUSxFQUNSLENBQUMsS0FBYSxFQUFFLE9BQWMsRUFBRSxRQUFlLEVBQUUsRUFBRTtRQUNqRCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0MsQ0FBQyxFQUNELEtBQUssRUFDTCxPQUFPLENB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