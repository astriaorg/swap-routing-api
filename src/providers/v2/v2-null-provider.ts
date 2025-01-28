import { Token } from "@uniswap/sdk-core";
import { IV2PoolProvider } from "../../contrib/smart-order-router/providers/v2/pool-provider";

export class V2NullProvider implements IV2PoolProvider {
  async getPools() {
    return {
      getPool: () => undefined,
      getPoolByAddress: () => undefined,
      getAllPools: () => [],
    };
  }
  getPoolAddress(tokenA: Token, tokenB: Token) {
    return {
      poolAddress: '',
      token0: tokenA,
      token1: tokenB
    };
  }
}
