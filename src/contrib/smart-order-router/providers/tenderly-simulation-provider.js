import axios from 'axios';
import { BigNumber } from 'ethers/lib/ethers';
import { Erc20__factory } from '../types/other/factories/Erc20__factory';
import { SwapRouter02__factory } from '../types/other/factories/SwapRouter02__factory';
import { ChainId, log, SWAP_ROUTER_ADDRESS } from '../util';
import { APPROVE_TOKEN_FOR_TRANSFER } from '../util/callData';
import { calculateGasUsed, initSwapRouteFromExisting, } from '../util/gas-factory-helpers';
const TENDERLY_BATCH_SIMULATE_API = (tenderlyBaseUrl, tenderlyUser, tenderlyProject) => `${tenderlyBaseUrl}/api/v1/account/${tenderlyUser}/project/${tenderlyProject}/simulate-batch`;
// We multiply tenderly gas estimate by this estimate to overestimate gas fee
const ESTIMATE_MULTIPLIER = 1.25;
const checkTokenApproved = async (fromAddress, inputAmount, provider) => {
    const tokenContract = Erc20__factory.connect(inputAmount.currency.wrapped.address, provider);
    const allowance = await tokenContract.allowance(fromAddress, SWAP_ROUTER_ADDRESS);
    // Return true if token allowance is greater than input amount
    return allowance.gt(BigNumber.from(inputAmount.quotient.toString()));
};
export class FallbackTenderlySimulator {
    constructor(tenderlyBaseUrl, tenderlyUser, tenderlyProject, tenderlyAccessKey, provider, v2PoolProvider, v3PoolProvider, tenderlySimulator) {
        this.tenderlySimulator =
            tenderlySimulator !== null && tenderlySimulator !== void 0 ? tenderlySimulator : new TenderlySimulator(tenderlyBaseUrl, tenderlyUser, tenderlyProject, tenderlyAccessKey, v2PoolProvider, v3PoolProvider);
        this.provider = provider;
        this.v2PoolProvider = v2PoolProvider;
        this.v3PoolProvider = v3PoolProvider;
    }
    async ethEstimateGas(fromAddress, route) {
        const currencyIn = route.trade.inputAmount.currency;
        const router = SwapRouter02__factory.connect(SWAP_ROUTER_ADDRESS, this.provider);
        const estimatedGasUsed = await router.estimateGas['multicall(bytes[])']([route.methodParameters.calldata], {
            from: fromAddress,
            value: BigNumber.from(currencyIn.isNative ? route.methodParameters.value : '0'),
        });
        const { estimatedGasUsedUSD, estimatedGasUsedQuoteToken, quoteGasAdjusted, } = await calculateGasUsed(route.quote.currency.chainId, route, estimatedGasUsed, this.v2PoolProvider, this.v3PoolProvider);
        return initSwapRouteFromExisting(route, this.v2PoolProvider, this.v3PoolProvider, quoteGasAdjusted, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD);
    }
    async simulateTransaction(fromAddress, swapRoute) {
        // Make call to eth estimate gas if possible
        // For erc20s, we must check if the token allowance is sufficient
        const inputAmount = swapRoute.trade.inputAmount;
        if (inputAmount.currency.isNative ||
            (await checkTokenApproved(fromAddress, inputAmount, this.provider))) {
            try {
                const swapRouteWithGasEstimate = await this.ethEstimateGas(fromAddress, swapRoute);
                return swapRouteWithGasEstimate;
            }
            catch (err) {
                log.info({ err }, 'Error calling eth estimate gas!');
                return { ...swapRoute, simulationError: true };
            }
        }
        // simulate via tenderly
        try {
            return await this.tenderlySimulator.simulateTransaction(fromAddress, swapRoute);
        }
        catch (err) {
            log.info({ err }, 'Failed to simulate via Tenderly!');
            // set error flag to true
            return { ...swapRoute, simulationError: true };
        }
    }
}
export class TenderlySimulator {
    constructor(tenderlyBaseUrl, tenderlyUser, tenderlyProject, tenderlyAccessKey, v2PoolProvider, v3PoolProvider) {
        this.tenderlyBaseUrl = tenderlyBaseUrl;
        this.tenderlyUser = tenderlyUser;
        this.tenderlyProject = tenderlyProject;
        this.tenderlyAccessKey = tenderlyAccessKey;
        this.v2PoolProvider = v2PoolProvider;
        this.v3PoolProvider = v3PoolProvider;
    }
    async simulateTransaction(fromAddress, swapRoute) {
        const currencyIn = swapRoute.trade.inputAmount.currency;
        const tokenIn = currencyIn.wrapped;
        const chainId = tokenIn.chainId;
        if ([ChainId.MAINNET, ChainId.FLAME_DEVNET, ChainId.FLAME_TESTNET].includes(chainId)) {
            const msg = 'Flame not supported by Tenderly!';
            log.info(msg);
            return { ...swapRoute, simulationError: true };
        }
        if (!swapRoute.methodParameters) {
            const msg = 'No calldata provided to simulate transaction';
            log.info(msg);
            throw new Error(msg);
        }
        const { calldata } = swapRoute.methodParameters;
        log.info({
            calldata: swapRoute.methodParameters.calldata,
            fromAddress,
            chainId,
            tokenInAddress: tokenIn.address,
        }, 'Simulating transaction via Tenderly');
        const approve = {
            network_id: chainId,
            input: APPROVE_TOKEN_FOR_TRANSFER,
            to: tokenIn.address,
            value: '0',
            from: fromAddress,
            gasPrice: '0',
            gas: 30000000,
        };
        const swap = {
            network_id: chainId,
            input: calldata,
            to: SWAP_ROUTER_ADDRESS,
            value: currencyIn.isNative ? swapRoute.methodParameters.value : '0',
            from: fromAddress,
            gasPrice: '0',
            gas: 30000000,
            type: 1,
        };
        const body = { simulations: [approve, swap] };
        const opts = {
            headers: {
                'X-Access-Key': this.tenderlyAccessKey,
            },
        };
        const url = TENDERLY_BATCH_SIMULATE_API(this.tenderlyBaseUrl, this.tenderlyUser, this.tenderlyProject);
        const resp = (await axios.post(url, body, opts)).data;
        // Validate tenderly response body
        if (!resp ||
            resp.simulation_results.length < 2 ||
            !resp.simulation_results[1].transaction ||
            resp.simulation_results[1].transaction.error_message) {
            const msg = `Failed to Simulate Via Tenderly!: ${resp.simulation_results[1].transaction.error_message}`;
            log.info({ err: resp.simulation_results[1].transaction.error_message }, msg);
            return { ...swapRoute, simulationError: true };
        }
        log.info({ approve: resp.simulation_results[0], swap: resp.simulation_results[1] }, 'Simulated Approval + Swap via Tenderly');
        // Parse the gas used in the simulation response object, and then pad it so that we overestimate.
        const estimatedGasUsed = BigNumber.from((resp.simulation_results[1].transaction.gas_used * ESTIMATE_MULTIPLIER).toFixed(0));
        const { estimatedGasUsedUSD, estimatedGasUsedQuoteToken, quoteGasAdjusted, } = await calculateGasUsed(chainId, swapRoute, estimatedGasUsed, this.v2PoolProvider, this.v3PoolProvider);
        return initSwapRouteFromExisting(swapRoute, this.v2PoolProvider, this.v3PoolProvider, quoteGasAdjusted, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvdGVuZGVybHktc2ltdWxhdGlvbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDMUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRzlDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUN2RixPQUFPLEVBQUUsT0FBTyxFQUFrQixHQUFHLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDNUUsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUQsT0FBTyxFQUNMLGdCQUFnQixFQUNoQix5QkFBeUIsR0FDMUIsTUFBTSw2QkFBNkIsQ0FBQztBQW1CckMsTUFBTSwyQkFBMkIsR0FBRyxDQUNsQyxlQUF1QixFQUN2QixZQUFvQixFQUNwQixlQUF1QixFQUN2QixFQUFFLENBQ0YsR0FBRyxlQUFlLG1CQUFtQixZQUFZLFlBQVksZUFBZSxpQkFBaUIsQ0FBQztBQUVoRyw2RUFBNkU7QUFDN0UsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFzQmpDLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxFQUM5QixXQUFtQixFQUNuQixXQUEyQixFQUMzQixRQUF5QixFQUNQLEVBQUU7SUFDcEIsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FDMUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUNwQyxRQUFRLENBQ1QsQ0FBQztJQUNGLE1BQU0sU0FBUyxHQUFHLE1BQU0sYUFBYSxDQUFDLFNBQVMsQ0FDN0MsV0FBVyxFQUNYLG1CQUFtQixDQUNwQixD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