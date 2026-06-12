import { Dispatch, SetStateAction } from "@rbxts/react";
import { UseThrottleOptions } from "../use-throttle-callback";
/**
 * Creates a throttled state that only updates at most once per every `wait`
 * seconds. Set to the most recently passed `state` after each interval.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @param value The value to throttle.
 * @param options The options object.
 * @returns The throttled value.
 */
export declare function useThrottleState<T>(initialState: T, options?: UseThrottleOptions): LuaTuple<[T, Dispatch<SetStateAction<T>>]>;
