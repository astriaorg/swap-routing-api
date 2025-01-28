import { USDC_FLAME_DEVNET, USDC_FLAME_TESTNET, USDC_MAINNET, } from '../../providers/token-provider';
import { ChainId, WRAPPED_NATIVE_CURRENCY } from '../../util/chains';
export const BASES_TO_CHECK_TRADES_AGAINST = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_tokenProvider) => {
    return {
        [ChainId.MAINNET]: [
            WRAPPED_NATIVE_CURRENCY[ChainId.MAINNET],
            USDC_MAINNET,
        ],
        [ChainId.FLAME_DEVNET]: [
            WRAPPED_NATIVE_CURRENCY[ChainId.FLAME_DEVNET],
            USDC_FLAME_DEVNET,
        ],
        [ChainId.FLAME_TESTNET]: [
            WRAPPED_NATIVE_CURRENCY[ChainId.FLAME_TESTNET],
            USDC_FLAME_TESTNET,
        ],
    };
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getBasePairByAddress = async (tokenProvider, _chainId, fromAddress, toAddress) => {
    const accessor = await tokenProvider.getTokens([toAddress]);
    const toToken = accessor.getTokenByAddress(toAddress);
    if (!toToken)
        return {};
    return {
        [fromAddress]: [toToken],
    };
};
export const ADDITIONAL_BASES = async (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_tokenProvider) => {
    return {
    // [ChainId.MAINNET]: {
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18',
    //     '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0x561a4717537ff4AF5c687328c0f7E90a319705C0',
    //     '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
    //     '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B'
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
    //     '0x956F47F50A910163D8BF957Cf5846D573E7f87CA'
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0x853d955acef822db058eb8505911ed77f175b99e',
    //     '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0'
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
    //     '0x853d955acef822db058eb8505911ed77f175b99e'
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    //     '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d'
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
    //     '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
    //   )),
    // },
    };
};
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES = async (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_tokenProvider) => {
    return {
    // [ChainId.MAINNET]: {
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
    //     DAI_MAINNET.address
    //   )),
    //   ...(await getBasePairByAddress(
    //     tokenProvider,
    //     ChainId.MAINNET,
    //     '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
    //     WRAPPED_NATIVE_CURRENCY[1]!.address
    //   )),
    // },
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcm91dGVycy9sZWdhY3ktcm91dGVyL2Jhc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ2xCLFlBQVksR0FDYixNQUFNLGdDQUFnQyxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQU1yRSxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBRztBQUMzQyw2REFBNkQ7QUFDN0QsY0FBOEIsRUFDZCxFQUFFO0lBQ2xCLE9BQU87UUFDTCxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQix1QkFBdUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFFO1lBQ3pDLFlBQVk7U0FDYjtRQUNELENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3RCLHVCQUF1QixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7WUFDN0MsaUJBQWlCO1NBQ2xCO1FBQ0QsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDdkIsdUJBQXVCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUM5QyxrQkFBa0I7U0FDbkI7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsNkRBQTZEO0FBQzdELGFBQWE7QUFDYiw2REFBNkQ7QUFDN0QsTUFBTSxvQkFBb0IsR0FBRyxLQUFLLEVBQ2hDLGFBQTZCLEVBQzdCLFFBQWlCLEVBQ2pCLFdBQW1CLEVBQ25CLFNBQWlCLEVBQzZCLEVBQUU7SUFDaEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM1RCxNQUFNLE9BQU8sR0FBc0IsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRXpFLElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTyxFQUFFLENBQUM7SUFFeEIsT0FBTztRQUNMLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUM7S0FDekIsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLEtBQUs7QUFDbkMsNkRBQTZEO0FBQzdELGNBQThCLEVBRzdCLEVBQUU7SUFDSCxPQUFPO0lBQ0wsdUJBQXVCO0lBQ3ZCLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCxtREFBbUQ7SUFDbkQsUUFBUTtJQUNSLEtBQUs7S0FDTixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sWUFBWSxHQUFHLEtBQUs7QUFDL0IsNkRBQTZEO0FBQzdELGNBQThCLEVBRzdCLEVBQUU7SUFDSCxPQUFPO0lBQ0wsdUJBQXVCO0lBQ3ZCLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCwwQkFBMEI7SUFDMUIsUUFBUTtJQUNSLG9DQUFvQztJQUNwQyxxQkFBcUI7SUFDckIsdUJBQXVCO0lBQ3ZCLG9EQUFvRDtJQUNwRCwwQ0FBMEM7SUFDMUMsUUFBUTtJQUNSLEtBQUs7S0FDTixDQUFDO0FBQ0osQ0FBQyxDQUFDIn0=