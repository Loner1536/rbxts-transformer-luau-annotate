import { Predicate } from "../use-previous";
/**
 * Returns a mutable ref that points to the latest value of the input.
 *
 * Takes an optional `predicate` function as the second argument that receives
 * the previous and current value. If the predicate returns `false`, the values
 * are not equal, and the previous value is updated.
 *
 * @param value The value to track.
 * @returns A mutable reference to the value.
 */
export declare function useLatest<T>(value: T, predicate?: Predicate<T>): import("@rbxts/react").MutableRefObject<T>;
