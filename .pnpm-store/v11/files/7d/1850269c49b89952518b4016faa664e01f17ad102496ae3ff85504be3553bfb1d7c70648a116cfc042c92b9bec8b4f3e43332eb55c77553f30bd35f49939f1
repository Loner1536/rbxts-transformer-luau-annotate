import { GlobalEvent } from "./events/types";
import { GlobalFunction } from "./functions/types";
import { Skip as NetworkingSkip } from "./middleware/skip";
import { NetworkingFunctionError } from "./function/errors";
import { EventMiddleware as _EventMiddleware, FunctionMiddleware as _FunctionMiddleware } from "./middleware/types";
import { IntrinsicDeclaration, NetworkUnreliable } from "./types";
export declare namespace Networking {
    /**
     * Creates a new event based off the supplied types.
     * @param serverMiddleware Middleware for server events
     * @param clientMiddleware Middleware for client events
     * @metadata macro
     */
    function createEvent<S, C>(name?: IntrinsicDeclaration): GlobalEvent<S, C>;
    /**
     * Creates a new function event based off the supplied types.
     * @param serverMiddleware Middleware for server events
     * @param clientMiddleware Middleware for client events
     * @metadata macro
     */
    function createFunction<S, C>(name?: IntrinsicDeclaration): GlobalFunction<S, C>;
    /**
     * Stops networking function middleware.
     */
    const Skip: NetworkingSkip;
    /**
     * Specifies that this event is unreliable.
     *
     * This will only work on remote events.
     */
    type Unreliable<T> = NetworkUnreliable<T>;
    /**
     * A function that generates an event middleware.
     */
    type EventMiddleware<I extends readonly unknown[] = unknown[]> = _EventMiddleware<I>;
    /**
     * A function that generates an event middleware.
     */
    type FunctionMiddleware<I extends readonly unknown[] = unknown[], O = void> = _FunctionMiddleware<I, O>;
}
export { NetworkingFunctionError };
