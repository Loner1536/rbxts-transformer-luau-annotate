import { Binding } from "@rbxts/react";
export interface BindingApi<T> {
    subscribe: (callback: (newValue: T) => void) => () => void;
    update: (newValue: T) => void;
    getValue: () => T;
}
export interface Lerpable<T> {
    Lerp: (this: T, to: T, alpha: number) => T;
}
export type BindingOrValue<T> = Binding<T> | T;
type Bindable<T = unknown> = Binding<T> | NonNullable<T>;
type ComposeBindings<T extends Bindable[]> = {
    [K in keyof T]: T[K] extends Bindable<infer U> ? U : T[K];
};
type BindingCombiner<T extends Bindable[], U> = (...values: ComposeBindings<T>) => U;
/**
 * Returns whether the given value is a binding.
 * @param value The value to check.
 * @returns Whether the value is a binding.
 */
export declare function isBinding<T>(value: T | Binding<T>): value is Binding<T>;
export declare function isBinding<T = unknown>(value: unknown): value is Binding<T>;
/**
 * Converts a value to a binding. If the given value is already a binding, it
 * will be returned as-is.
 * @param value The value to convert.
 * @returns The converted binding.
 */
export declare function toBinding<T>(value: T | Binding<T>): Binding<T>;
/**
 * Returns the value of a binding. If the given value is not a binding, it will
 * be returned as-is.
 * @param binding The binding to get the value of.
 * @returns The value of the binding.
 */
export declare function getBindingValue<T>(binding: T | Binding<T>): T;
/**
 * Maps a binding to a new binding. If the given value is not a binding, it will
 * be passed to the mapper function and returned as a new binding.
 * @param binding The binding to map.
 * @param callback The mapper function.
 * @returns The mapped binding.
 */
export declare function mapBinding<T, U>(binding: T | Binding<T>, callback: (value: T) => U): Binding<U>;
/**
 * Joins a map of bindings into a single binding. If any of the given values
 * are not bindings, they will be wrapped in a new binding.
 * @param bindings The bindings to join.
 * @returns The joined binding.
 */
export declare function joinAnyBindings<T extends Readonly<Record<string, unknown>>>(bindings: T): Binding<{
    [K in keyof T]: T[K] extends BindingOrValue<infer U> ? U : T[K];
}>;
export declare function joinAnyBindings<T extends readonly unknown[]>(bindings: readonly [...T]): Binding<{
    [K in keyof T]: T[K] extends BindingOrValue<infer U> ? U : T[K];
}>;
/**
 * Gets the internal API of a binding. This is a hacky way to get access to the
 * `BindingInternalApi` object of a binding, which is not exposed by React.
 * @param binding The binding to get the internal API of.
 * @returns The binding's API.
 */
export declare function getBindingApi<T>(binding: Binding<T>): BindingApi<T> | undefined;
/**
 * Returns a binding that lerps between two values using the given binding as
 * the alpha.
 * @param binding The binding to use as the alpha.
 * @param from The value to lerp from.
 * @param to The value to lerp to.
 * @returns A binding that lerps between two values.
 */
export declare function lerpBinding<T extends number | Lerpable<any>>(binding: Binding<number> | number, from: T, to: T): Binding<T>;
/**
 * Composes multiple bindings or values together into a single binding.
 * Calls the combiner function with the values of the bindings when any
 * of the bindings change.
 * @param ...bindings A list of bindings or values.
 * @param combiner The function that maps the bindings to a new value.
 * @returns A binding that returns the result of the combiner.
 */
export declare function composeBindings<T extends Bindable[], U>(...bindings: [...T, BindingCombiner<T, U>]): Binding<U>;
export {};
