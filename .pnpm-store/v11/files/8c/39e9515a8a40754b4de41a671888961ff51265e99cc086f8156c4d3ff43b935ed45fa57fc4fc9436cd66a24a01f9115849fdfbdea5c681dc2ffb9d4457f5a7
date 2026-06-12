export type RefFunction<T> = (rbx?: T) => void;
/**
 * Composes multiple ref functions into a single ref function and memoizes
 * the result.
 *
 * To prevent excess ref calls, the composed ref is only created once on mount.
 * However, it will call the latest refs passed, so it is safe to pass in refs
 * that might change.
 *
 * @param refs The ref functions to compose.
 * @returns A ref function that calls all of the ref functions passed in.
 */
export declare function useComposedRef<T>(...refs: (RefFunction<T> | undefined)[]): RefFunction<T>;
/**
 * Composes multiple ref functions into a single ref function.
 * @param refs The ref functions to compose.
 * @returns A ref function that calls all of the ref functions passed in.
 */
export declare function composeRefs<T>(...refs: (RefFunction<T> | undefined)[]): RefFunction<T>;
