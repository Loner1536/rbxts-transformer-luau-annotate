import { NetworkInfo } from "../types";
import { NetworkingFunctionError } from "./errors";
import { MiddlewareFactory } from "../middleware/types";
export interface CreateFunctionReceiverOptions {
    /**
     * The namespace this event should be created in.
     */
    namespace: string;
    /**
     * The name of the remote instance, not necessarily unique and used for debugging purposes.
     */
    debugName: string;
    /**
     * The remote's ID which must be unique.
     */
    id: string;
    /**
     * Information about the network, which includes some of the above.
     *
     * Passed to the middleware.
     */
    networkInfo: NetworkInfo;
    /**
     * This function will be called when we receive a response, and can be used to resolve or reject values.
     */
    incomingMiddleware?: MiddlewareFactory<any[], any>[];
}
export interface RequestInfo {
    nextId: number;
    requests: Map<number, (value: unknown, rejection?: NetworkingFunctionError) => void>;
}
export interface FunctionReceiverInterface {
    setServerCallback(callback: (player: Player, ...args: unknown[]) => unknown): void;
    setClientCallback(callback: (...args: unknown[]) => unknown): void;
    invoke(player: Player | undefined, ...args: unknown[]): Promise<unknown>;
}
export declare function createFunctionReceiver(options: CreateFunctionReceiverOptions): FunctionReceiverInterface;
