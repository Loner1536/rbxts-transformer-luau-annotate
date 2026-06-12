import type { Modding } from "./modding";
export type Constructor<T = object> = new (...args: never[]) => T;
export type AbstractConstructor<T = object> = abstract new (...args: never[]) => T;
/** @hidden */
export type IntrinsicSymbolId<T> = Modding.Intrinsic<"symbol-id", [T], string>;
export declare function isConstructor(obj: object): obj is Constructor;
export declare function isAbstractConstructor(obj: object): obj is AbstractConstructor;
