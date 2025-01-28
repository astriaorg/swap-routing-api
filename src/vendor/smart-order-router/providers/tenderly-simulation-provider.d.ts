import { JsonRpcProvider } from '@ethersproject/providers';
import { SwapRoute } from '../routers';
import { IV2PoolProvider } from './v2/pool-provider';
import { IV3PoolProvider } from './v3/pool-provider';
declare type SimulationResult = {
    transaction: {
        hash: string;
        gas_used: number;
        error_message: string;
    };
    simulation: {
        state_overrides: Record<string, unknown>;
    };
};
export declare type TenderlyResponse = {
    config: {
        url: string;
        method: string;
        data: string;
    };
    simulation_results: [SimulationResult, SimulationResult];
};
/**
 * Provider for dry running transactions.
 *
 * @export
 * @interface ISimulator
 */
export interface ISimulator {
    /**
     * Returns a new SwapRoute with updated gas estimates
     * All clients that implement this interface must set
     * simulationError = true in the returned SwapRoute
     * if simulation is not successful
     * @returns SwapRoute
     */
    simulateTransaction: (fromAddress: string, swapRoute: SwapRoute) => Promise<SwapRoute>;
}
export declare class FallbackTenderlySimulator implements ISimulator {
    private provider;
    private tenderlySimulator;
    private v3PoolProvider;
    private v2PoolProvider;
    constructor(tenderlyBaseUrl: string, tenderlyUser: string, tenderlyProject: string, tenderlyAccessKey: string, provider: JsonRpcProvider, v2PoolProvider: IV2PoolProvider, v3PoolProvider: IV3PoolProvider, tenderlySimulator?: TenderlySimulator);
    private ethEstimateGas;
    simulateTransaction(fromAddress: string, swapRoute: SwapRoute): Promise<SwapRoute>;
}
export declare class TenderlySimulator implements ISimulator {
    private tenderlyBaseUrl;
    private tenderlyUser;
    private tenderlyProject;
    private tenderlyAccessKey;
    private v2PoolProvider;
    private v3PoolProvider;
    constructor(tenderlyBaseUrl: string, tenderlyUser: string, tenderlyProject: string, tenderlyAccessKey: string, v2PoolProvider: IV2PoolProvider, v3PoolProvider: IV3PoolProvider);
    simulateTransaction(fromAddress: string, swapRoute: SwapRoute): Promise<SwapRoute>;
}
export {};
