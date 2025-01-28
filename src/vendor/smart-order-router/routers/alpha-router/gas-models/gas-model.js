import { USDC_FLAME_DEVNET, USDC_FLAME_TESTNET, USDC_MAINNET, } from '../../../providers/token-provider';
import { ChainId } from '../../../util/chains';
export const usdGasTokensByChain = {
    [ChainId.MAINNET]: [USDC_MAINNET],
    [ChainId.FLAME_DEVNET]: [USDC_FLAME_DEVNET],
    [ChainId.FLAME_TESTNET]: [USDC_FLAME_TESTNET],
};
/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IV2GasModelFactory
 */
export class IV2GasModelFactory {
}
/**
 * Factory for building gas models that can be used with any route to generate
 * gas estimates.
 *
 * Factory model is used so that any supporting data can be fetched once and
 * returned as part of the model.
 *
 * @export
 * @abstract
 * @class IOnChainGasModelFactory
 */
export class IOnChainGasModelFactory {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FzLW1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3JvdXRlcnMvYWxwaGEtcm91dGVyL2dhcy1tb2RlbHMvZ2FzLW1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ2xCLFlBQVksR0FDYixNQUFNLG1DQUFtQyxDQUFDO0FBUzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQVEvQyxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FBdUM7SUFDckUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUM7SUFDakMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUMzQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0NBQzlDLENBQUM7QUFtREY7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sT0FBZ0Isa0JBQWtCO0NBT3ZDO0FBRUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sT0FBZ0IsdUJBQXVCO0NBVzVDIn0=