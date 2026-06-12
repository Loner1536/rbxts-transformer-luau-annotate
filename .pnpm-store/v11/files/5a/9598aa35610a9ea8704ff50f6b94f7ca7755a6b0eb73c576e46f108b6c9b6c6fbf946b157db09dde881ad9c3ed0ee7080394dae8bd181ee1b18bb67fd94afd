import { AbstractConstructor, Constructor, IntrinsicSymbolId } from "./utility";
import { t } from "@rbxts/t";
interface BaseDescriptor {
    /**
     * The ID of this decorator.
     */
    id: string;
    /**
     * The object this decorator is attached to.
     */
    object: AbstractConstructor;
    /**
     * The constructor this decorator is attached to, unless abstract.
     */
    constructor?: Constructor;
}
export interface ClassDescriptor extends BaseDescriptor {
}
export interface MethodDescriptor extends PropertyDescriptor {
}
export interface PropertyDescriptor extends BaseDescriptor {
    property: string;
    isStatic: boolean;
}
interface AttachedDecorator<T extends readonly unknown[]> {
    object: AbstractConstructor;
    constructor?: Constructor;
    arguments: T;
}
type TSDecorator<T> = T & {
    _flamework_Decorator: never;
};
type ClassDecorator = TSDecorator<(ctor: defined) => never>;
type MethodDecorator = TSDecorator<(target: defined, propertyKey: string, descriptor: defined) => never>;
type PropertyDecorator = TSDecorator<(target: defined, propertyKey: string) => never>;
type DecoratorWithMetadata<T, P> = T & {
    _flamework_Parameters: P;
};
type DecoratorParameters<T> = T extends {
    _flamework_Parameters: infer P;
} ? P : [];
type AnyDecorator = DecoratorWithMetadata<(...args: never[]) => unknown, unknown[]>;
type Decorator<P extends readonly unknown[], D> = DecoratorWithMetadata<P extends {
    length: 0;
} ? ((...args: P) => D) & D : (...args: P) => D, P>;
type ListenerAddedEvent = (object: object) => void;
type ListenerRemovedEvent = (object: object) => void;
type DependencyRegistration = object | ((ctor: Constructor) => object);
export declare namespace Modding {
    /**
     * Retrieves an object from its identifier.
     *
     * The reverse (getting an identifier from an object) can be achieved using the Reflect API directly.
     */
    export function getObjectFromId(id: string): object | undefined;
    /**
     * Registers a listener for lifecycle events.
     */
    export function addListener(object: object): void;
    /**
     * Removes a listener for lifecycle events and decorators.
     */
    export function removeListener(object: object): void;
    /**
     * Registers a listener added event.
     * Fires whenever any listener is added.
     *
     * Fires for all existing listeners.
     */
    export function onListenerAdded(func: ListenerAddedEvent): RBXScriptConnection;
    /**
     * Registers a listener added event.
     * Fires whenever a listener has a decorator with the specified ID.
     *
     * Fires for all existing listeners.
     *
     * @metadata macro
     */
    export function onListenerAdded<T extends AnyDecorator>(func: ListenerAddedEvent, id?: IdRef<T>): RBXScriptConnection;
    /**
     * Registers a listener added event.
     * Fires whenever a listener has a lifecycle event with the specified ID.
     *
     * Fires for all existing listeners.
     *
     * @metadata macro
     */
    export function onListenerAdded<T>(func: (value: T) => void, id?: IdRef<T>): RBXScriptConnection;
    /**
     * Registers a listener removed event.
     *
     * Fires whenever any listener is removed.
     */
    export function onListenerRemoved(func: ListenerRemovedEvent): RBXScriptConnection;
    /**
     * Registers a listener removed event.
     *
     * Fires whenever a listener has a decorator with the specified ID.
     *
     * @metadata macro
     */
    export function onListenerRemoved<T extends AnyDecorator>(func: ListenerRemovedEvent, id?: IdRef<T>): RBXScriptConnection;
    /**
     * Registers a listener removed event.
     *
     * Fires whenever a listener has a lifecycle event with the specified ID.
     *
     * @metadata macro
     */
    export function onListenerRemoved<T>(func: (object: T) => void, id?: IdRef<T>): RBXScriptConnection;
    /**
     * Registers a class decorator.
     */
    export function createDecorator<T extends readonly unknown[] = void[]>(kind: "Class", func: (descriptor: ClassDescriptor, config: T) => void): Decorator<T, ClassDecorator>;
    /**
     * Registers a method decorator.
     */
    export function createDecorator<T extends readonly unknown[] = void[]>(kind: "Method", func: (descriptor: MethodDescriptor, config: T) => void): Decorator<T, MethodDecorator>;
    /**
     * Registers a property decorator.
     */
    export function createDecorator<T extends readonly unknown[] = void[]>(kind: "Property", func: (descriptor: PropertyDescriptor, config: T) => void): Decorator<T, PropertyDecorator>;
    /**
     * Registers a metadata class decorator.
     */
    export function createMetaDecorator<T extends readonly unknown[] = void[]>(kind: "Class"): Decorator<T, ClassDecorator>;
    /**
     * Registers a metadata method decorator.
     */
    export function createMetaDecorator<T extends readonly unknown[] = void[]>(kind: "Method"): Decorator<T, MethodDecorator>;
    /**
     * Registers a metadata property decorator.
     */
    export function createMetaDecorator<T extends readonly unknown[] = void[]>(kind: "Property"): Decorator<T, PropertyDecorator>;
    /**
     * Retrieves registered decorators.
     *
     * @metadata macro
     */
    export function getDecorators<T extends AnyDecorator>(id?: IdRef<T>): AttachedDecorator<DecoratorParameters<T>>[];
    /**
     * Creates a map of every property using the specified decorator.
     *
     * @metadata macro
     */
    export function getPropertyDecorators<T extends AnyDecorator>(obj: object, id?: IdRef<T>): Map<string, {
        arguments: DecoratorParameters<T>;
    }>;
    /**
     * Retrieves a decorator from an object or its properties.
     *
     * @metadata macro
     */
    export function getDecorator<T extends AnyDecorator>(object: object, property?: string, id?: IdRef<T>): {
        arguments: DecoratorParameters<T>;
    } | undefined;
    /**
     * Retrieves a singleton or instantiates one if it does not exist.
     */
    export function resolveSingleton<T extends object>(ctor: Constructor<T>): T;
    /**
     * Modifies dependency resolution for a specific ID.
     *
     * If a function is passed, it will be called, passing the target constructor, every time that ID needs to be resolved.
     * Otherwise, the passed object is returned directly.
     *
     * @metadata macro
     */
    export function registerDependency<T>(dependency: DependencyRegistration, id?: IdRef<T>): void;
    /**
     * Instantiates this class using dependency injection.
     */
    export function createDependency<T extends object>(ctor: Constructor<T>, options?: DependencyResolutionOptions): T;
    /**
     * Creates an object for this class and returns a deferred constructor.
     */
    export function createDeferredDependency<T extends object>(ctor: Constructor<T>, options?: DependencyResolutionOptions): readonly [T, () => void];
    /**
     * This function is able to utilize Flamework's user macros to generate and inspect types.
     * This function supports all values natively supported by Flamework's user macros.
     *
     * For example, if you want to retrieve the properties of an instance, you could write code like this:
     * ```ts
     * // Returns an array of all keys part of the union.
     * const basePartKeys = Modding.inspect<InstancePropertyNames<BasePart>[]>();
     * ```
     *
     * @metadata macro
     */
    export function inspect<T>(value?: Modding.Many<T>): T;
    /**
     * This API allows you to use more complex queries, inspect types, generate arbitrary objects based on types, etc.
     *
     * @experimental This API is considered experimental and may change.
     */
    export type Many<T> = T & {
        /** @hidden */ _flamework_macro_many: T;
    };
    /**
     * Hashes a string literal type (such as an event name) under Flamework's {@link Many `Many`} API.
     *
     * The second type argument, `C`, is for providing a context to the hashing which will generate new hashes
     * for strings which already have a hash under another context.
     *
     * @experimental This API is considered experimental and may change.
     */
    export type Hash<T extends string, C extends string = never> = string & {
        /** @hidden */ _flamework_macro_hash: [T, C];
    };
    /**
     * This is equivalent to {@link Hash `Hash`} except it will only hash strings when `obfuscation` is turned on.
     *
     * @experimental This API is considered experimental and may change.
     */
    export type Obfuscate<T extends string, C extends string = never> = string & {
        /** @hidden */ _flamework_macro_hash: [T, C, true];
    };
    /**
     * Retrieves the labels from this tuple under Flamework's {@link Many `Many`} API.
     *
     * This can also be used to extract parameter names via `Parameters<T>`
     *
     * @experimental This API is considered experimental and may change.
     */
    export type TupleLabels<T extends readonly unknown[]> = (string[] & {
        _flamework_macro_tuple_labels: T;
    }) | undefined;
    /**
     * Retrieves metadata about the specified type using Flamework's user macros.
     */
    export type Generic<T, M extends keyof GenericMetadata<T>> = GenericMetadata<T>[M] & {
        /** @hidden */ _flamework_macro_generic: [T, M];
    };
    /**
     * Retrieves multiple types of metadata from Flamework's user macros.
     */
    export type GenericMany<T, M extends keyof GenericMetadata<T>> = Modding.Many<{
        [k in M]: Generic<T, k>;
    }>;
    /**
     * Retrieves metadata about the callsite using Flamework's user macros.
     */
    export type Caller<M extends keyof CallerMetadata> = CallerMetadata[M] & {
        /** @hidden */ _flamework_macro_caller: M;
    };
    /**
     * Retrieves multiple types of metadata about the callsite using Flamework's user macros.
     */
    export type CallerMany<M extends keyof CallerMetadata> = Modding.Many<{
        [k in M]: Caller<k>;
    }>;
    /**
     * An internal type for intrinsic user macro metadata.
     *
     * @hidden
     */
    export type Intrinsic<N extends string, M extends unknown[], T = symbol> = T & {
        _flamework_intrinsic: [N, ...M];
    };
    interface CallerMetadata {
        /**
         * The starting line of the expression.
         */
        line: number;
        /**
         * The char at the start of the expression relative to the starting line.
         */
        character: number;
        /**
         * The width of the expression.
         * This includes the width of multiline statements.
         */
        width: number;
        /**
         * A unique identifier that can be used to identify exact callsites.
         * This can be used for hooks.
         */
        uuid: string;
        /**
         * The source text for the expression.
         */
        text: string;
    }
    interface GenericMetadata<T> {
        /**
         * The ID of the type.
         */
        id: string;
        /**
         * A string equivalent of the type.
         */
        text: string;
        /**
         * A generated guard for the type.
         */
        guard: t.check<T>;
    }
    type IdRef<T> = string | IntrinsicSymbolId<T>;
    export {};
}
interface DependencyResolutionOptions {
    /**
     * Fires whenever a dependency is attempting to be resolved.
     *
     * Return undefined to let Flamework resolve it.
     */
    handle?: (id: string, index: number) => unknown;
    /**
     * Fires whenever Flamework tries to resolve a primitive (e.g string)
     */
    handlePrimitive?: (id: string, index: number) => defined;
}
export {};
