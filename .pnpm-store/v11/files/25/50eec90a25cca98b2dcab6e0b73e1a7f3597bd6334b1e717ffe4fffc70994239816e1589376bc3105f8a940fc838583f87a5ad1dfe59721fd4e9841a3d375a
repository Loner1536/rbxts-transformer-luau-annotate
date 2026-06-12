interface EventListenerOptions {
    /**
     * Whether the event should be connected or not. Defaults to `true`.
     */
    connected?: boolean;
    /**
     * Whether the event should be disconnected after the first invocation.
     * Defaults to `false`.
     */
    once?: boolean;
}
type EventLike<T extends Callback = Callback> = {
    Connect(callback: T): ConnectionLike;
} | {
    connect(callback: T): ConnectionLike;
} | {
    subscribe(callback: T): ConnectionLike;
};
type ConnectionLike = {
    Disconnect(): void;
} | {
    disconnect(): void;
} | (() => void);
/**
 * Subscribes to an event-like object. The subscription is automatically
 * disconnected when the component unmounts.
 *
 * If the event or listener is `undefined`, the event will not be subscribed to,
 * and the subscription will be disconnected if it was previously connected.
 *
 * The listener is memoized, so it is safe to pass a callback that is recreated
 * on every render.
 *
 * @param event The event-like object to subscribe to.
 * @param listener The listener to subscribe with.
 * @param options Options for the subscription.
 */
export declare function useEventListener<T extends EventLike>(event?: T, listener?: T extends EventLike<infer U> ? U : never, options?: EventListenerOptions): void;
export {};
