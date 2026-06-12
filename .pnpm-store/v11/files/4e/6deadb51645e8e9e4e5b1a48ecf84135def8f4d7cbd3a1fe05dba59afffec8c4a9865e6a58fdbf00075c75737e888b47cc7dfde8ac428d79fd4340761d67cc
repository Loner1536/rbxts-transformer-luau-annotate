export type Predicate<T> = (previous: T | undefined, current: T) => boolean;
export declare const isStrictEqual: (a: unknown, b: unknown) => boolean;
/**
 * Returns the most recent value from the previous render. Returns `undefined`
 * on the first render.
 *
 * Takes an optional `predicate` function as the second argument that receives
 * the previous and current value. If the predicate returns `false`, the values
 * are not equal, and the previous value is updated.
 *
 * @param value The value to return on the next render if it changes.
 * @param predicate Optional function to determine whether the value changed.
 * Defaults to a strict equality check (`===`).
 * @returns The previous value.
 */
export declare function usePrevious<T>(value: T, predicate?: Predicate<T>): T | undefined;
