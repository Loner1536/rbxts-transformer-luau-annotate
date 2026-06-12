import { Dispatch, SetStateAction } from "@rbxts/react";
/**
 * Like `useState`, but `setState` will update the state on the next Heartbeat
 * frame. Only the latest update in a frame will run.
 *
 * This is useful for improving performance when updating state in response to
 * events that fire rapidly in succession.
 *
 * @param initialState Optional initial state
 * @returns A tuple containing the state and a function to update it
 */
export declare function useDeferState<T>(initialState: T | (() => T)): LuaTuple<[state: T, setState: Dispatch<SetStateAction<T>>]>;
export declare function useDeferState<T = undefined>(initialState?: void): LuaTuple<[state: T | undefined, setState: Dispatch<SetStateAction<T | undefined>>]>;
