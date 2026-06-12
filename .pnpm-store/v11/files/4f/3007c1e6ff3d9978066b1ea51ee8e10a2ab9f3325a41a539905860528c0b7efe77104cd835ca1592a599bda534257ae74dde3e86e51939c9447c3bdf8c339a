/**
 * Defers a callback to be executed on the next Heartbeat frame. Consecutive
 * calls to the returned `execute` function will cancel the previous call.
 * @param callback The callback to defer
 * @returns A tuple containing the `execute` and `cancel` functions
 */
export declare function useDeferCallback<T extends unknown[]>(callback: (...args: T) => void): LuaTuple<[execute: (...args: T) => void, cancel: () => void]>;
