import { t } from "@rbxts/t";
import { Modding } from "./modding";
import { AbstractConstructor, Constructor, IntrinsicSymbolId } from "./utility";
export declare namespace Flamework {
    interface ServiceConfig {
        loadOrder?: number;
    }
    interface ControllerConfig {
        loadOrder?: number;
    }
    interface Decorator {
        arguments: unknown[];
    }
    /** @hidden */
    function resolveDependency<T>(id: string): T;
    /** @hidden */
    function _addPaths(paths: string[][]): void;
    /** @hidden */
    function _addPathsGlob(arg: string): void;
    /** @hidden */
    function _implements<T>(object: unknown, id: string): object is T;
    /**
     * Explicitly include an optional class in the startup cycle.
     */
    function includeOptionalClass(ctor: Constructor): void;
    /**
     * Initialize Flamework.
     *
     * This will start up the lifecycle events on all currently registered
     * classes.
     *
     * You should preload all necessary directories before calling this
     * as newly registered classes will not run their lifecycle events.
     */
    function ignite(): void;
    /**
     * Preload the specified paths by requiring all ModuleScript descendants.
     *
     * @metadata macro intrinsic-arg-shift {@link _addPaths intrinsic-flamework-rewrite}
     */
    function addPaths<T extends string>(path: T, meta?: Modding.Intrinsic<"path", [T]>): void;
    /**
     * Preload the specified paths by requiring all ModuleScript descendants.
     *
     * This function supports globs allowing you to match files or directories based on patterns,
     * but it should be noted that this can generate really large lists of paths and it is recommended to capture as few matches as possible.
     *
     * @metadata macro intrinsic-arg-shift {@link _addPathsGlob intrinsic-flamework-rewrite}
     */
    function addPathsGlob<T extends string>(path: T, meta?: Modding.Intrinsic<"pathglob", [T]>): void;
    /**
     * Retrieve the identifier for the specified type.
     *
     * @metadata macro {@link id intrinsic-inline}
     */
    function id<T>(id?: IntrinsicSymbolId<T>): string;
    /**
     * Check if the constructor implements the specified interface.
     *
     * @metadata macro {@link _implements intrinsic-flamework-rewrite}
     */
    function implements<T>(object: AbstractConstructor, id?: IntrinsicSymbolId<T>): boolean;
    /**
     * Check if object implements the specified interface.
     *
     * @metadata macro {@link _implements intrinsic-flamework-rewrite}
     */
    function implements<T>(object: unknown, id?: IntrinsicSymbolId<T>): object is T;
    /**
     * Hash a function using the method used internally by Flamework.
     * If a context is provided, then Flamework will create a new hash
     * if the specified string does not have one in that context.
     * @param str The string to hash
     * @param context A scope for the hash
     * @metadata macro {@link meta intrinsic-inline}
     */
    function hash<T extends string, C extends string = never>(meta?: Modding.Hash<T, C>): string;
    /**
     * Creates a type guard from any arbitrary type.
     *
     * @metadata macro
     */
    function createGuard<T>(meta?: Modding.Generic<T, "guard">): t.check<T>;
}
/**
 * This function resolves a dependency and can be called outside of the usual dependency injection lifecycle.
 *
 * This function can make it harder to stub, test or modify your code so it is recommended to use this macro minimally.
 * It is recommended that you pass dependencies to code that needs it from a singleton, component, etc.
 *
 * @metadata macro {@link Flamework.resolveDependency intrinsic-flamework-rewrite}
 */
export declare function Dependency<T>(id?: IntrinsicSymbolId<T>): T;
/**
 * Register a class as a Service.
 *
 * @server
 * @metadata flamework:implements flamework:parameters injectable
 */
export declare const Service: ((opts?: Flamework.ServiceConfig | undefined) => ((ctor: defined) => never) & {
    _flamework_Decorator: never;
}) & {
    _flamework_Parameters: [opts?: Flamework.ServiceConfig | undefined];
};
/**
 * Register a class as a Controller.
 *
 * @client
 * @metadata flamework:implements flamework:parameters injectable
 */
export declare const Controller: ((opts?: Flamework.ControllerConfig | undefined) => ((ctor: defined) => never) & {
    _flamework_Decorator: never;
}) & {
    _flamework_Parameters: [opts?: Flamework.ControllerConfig | undefined];
};
/**
 * Marks a singleton as optional.
 *
 * This singleton will only be included if it is depended on or is explicitly included with `Flamework.includeOptionalClass`.
 */
export declare const Optional: ((...args: void[]) => ((ctor: defined) => never) & {
    _flamework_Decorator: never;
}) & {
    _flamework_Parameters: void[];
};
/**
 * Hook into the OnInit lifecycle event.
 */
export interface OnInit {
    /**
     * This function will be called whenever the game is starting up.
     * This should only be used to setup your object prior to other objects using it.
     *
     * It's safe to load dependencies here, but it is not safe to use them.
     * Yielding or returning a promise will delay initialization of other dependencies.
     *
     * @hideinherited
     */
    onInit(): void | Promise<void>;
}
/**
 * Hook into the OnStart lifecycle event.
 */
export interface OnStart {
    /**
     * This function will be called after the game has been initialized.
     * This function will be called asynchronously.
     *
     * @hideinherited
     */
    onStart(): void;
}
/**
 * Hook into the OnTick lifecycle event.
 * Equivalent to: RunService.Heartbeat
 */
export interface OnTick {
    /**
     * Called every frame, after physics.
     *
     * @hideinherited
     */
    onTick(dt: number): void;
}
/**
 * Hook into the OnPhysics lifecycle event.
 * Equivalent to: RunService.Stepped
 */
export interface OnPhysics {
    /**
     * Called every frame, before physics.
     *
     * @hideinherited
     */
    onPhysics(dt: number, time: number): void;
}
/**
 * Hook into the OnRender lifecycle event.
 * Equivalent to: RunService.RenderStepped
 *
 * @client
 */
export interface OnRender {
    /**
     * Called every frame, before rendering.
     * Only available for controllers.
     *
     * @hideinherited
     */
    onRender(dt: number): void;
}
