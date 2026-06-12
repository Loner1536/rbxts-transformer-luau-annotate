export type AsyncState<T> = {
    status: PromiseConstructor["Status"]["Started"];
    message?: undefined;
    value?: undefined;
} | {
    status: PromiseConstructor["Status"]["Resolved"];
    message?: undefined;
    value: T;
} | {
    status: PromiseConstructor["Status"]["Cancelled"] | PromiseConstructor["Status"]["Rejected"];
    message: unknown;
    value?: undefined;
};
export type AsyncCallback<T, U extends unknown[]> = (...args: U) => Promise<T>;
/**
 * Returns a tuple containing the current state of the promise and a callback
 * to start a new promise. Calling it will cancel any previous promise.
 * @param callback The async callback.
 * @returns The state and a new callback.
 */
export declare function useAsyncCallback<T, U extends unknown[]>(callback: AsyncCallback<T, U>): LuaTuple<[AsyncState<T>, AsyncCallback<T, U>]>;
