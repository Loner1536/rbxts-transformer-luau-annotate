import { MiddlewareFactory, MiddlewareProcessor } from "../middleware/types";
import { NetworkInfo } from "../types";
export interface CreateEventOptions {
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
     * The reliability of this remote.
     *
     * Defaults to reliable.
     */
    reliability?: "reliable" | "unreliable";
    /**
     * A list of middleware that this event uses when it receives an event.
     */
    incomingMiddleware?: MiddlewareFactory<any[], void>[];
}
export interface EventInterface {
    fireEither(player: Player | undefined, ...args: unknown[]): void;
    fireServer(...args: unknown[]): void;
    fireClient(player: Player, ...args: unknown[]): void;
    fireAllClients(...args: unknown[]): void;
    connectServer(callback: (player: Player, ...args: unknown[]) => void): RBXScriptConnection;
    connectClient(callback: (...args: unknown[]) => void): RBXScriptConnection;
    invoke: MiddlewareProcessor<any[], void>;
}
export declare function createEvent(options: CreateEventOptions): EventInterface;
