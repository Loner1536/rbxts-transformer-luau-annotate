export interface UseIntervalOptions {
    /**
     * Whether the callback should run immediately when the interval is set.
     * Defaults to `false`.
     */
    immediate?: boolean;
}
/**
 * Sets an interval that runs the callback function every `delay` seconds. If
 * `delay` is `undefined`, the interval is cleared. If the delay changes, the
 * interval is reset.
 * @param callback The callback function to run.
 * @param delay The delay in seconds between each interval.
 * @param options The options for the interval.
 * @returns A function that clears the interval.
 */
export declare function useInterval(callback: () => void, delay?: number, options?: UseIntervalOptions): () => void;
