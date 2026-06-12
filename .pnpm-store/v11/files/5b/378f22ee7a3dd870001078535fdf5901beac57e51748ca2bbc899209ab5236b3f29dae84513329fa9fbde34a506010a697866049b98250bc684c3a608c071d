import { Binding } from "@rbxts/react";
/**
 * Subscribes to a binding and calls the given listener when the binding
 * updates. If the value passed is not a binding, the listener will be called
 * with the value.
 *
 * The `listener` function is safe to not be memoized, as it will only be
 * called when the binding updates.
 *
 * @param binding The binding to subscribe to.
 * @param listener The function to call when the binding updates.
 */
export declare function useBindingListener<T>(binding: T | Binding<T>, listener: (value: T) => void): void;
