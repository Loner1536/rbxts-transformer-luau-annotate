import { NetworkInfo } from "../types";
import { NetworkingFunctionError } from "./errors";
export interface CreateFunctionSenderOptions {
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
    responseMiddleware?: (player: Player | undefined, value: unknown, resolve: (value: unknown) => void, reject: (value: unknown) => void) => void;
}
export interface RequestInfo {
    nextId: number;
    requests: Map<number, (value: unknown, rejection?: NetworkingFunctionError) => void>;
}
export interface FunctionSenderInterface {
    invokeServer(...args: unknown[]): Promise<unknown>;
    invokeClient(player: Player, ...args: unknown[]): Promise<unknown>;
}
export declare function createFunctionSender(options: CreateFunctionSenderOptions): FunctionSenderInterface;
