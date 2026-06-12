/**
 * @hidden @deprecated
 */
export declare const SYMBOL_ATTRIBUTE_SETTER: unique symbol;
/**
 * This is the base component class which handles instance guards, attribute guards and cleanup.
 *
 * You should not construct this class manually, and all components must extend this class.
 */
export declare class BaseComponent<A = {}, I extends Instance = Instance> {
    /**
     * Attributes attached to this instance.
     *
     * @metadata intrinsic-component-attributes
     */
    attributes: A;
    /**
     * The instance this component is attached to.
     * This should only be called in a component lifecycle event.
     *
     * @metadata intrinsic-component-instance
     */
    instance: I;
    /** @hidden @deprecated */
    [SYMBOL_ATTRIBUTE_SETTER]<T extends keyof A>(key: T, value: A[T], postfix?: boolean): A[T];
    /**
     * Connect a callback to the change of a specific attribute.
     * @param name The name of the attribute
     * @param cb The callback
     */
    onAttributeChanged<K extends keyof A>(name: K, cb: (newValue: A[K], oldValue: A[K]) => void): RBXScriptConnection;
    /**
     * Destroys this component instance.
     */
    destroy(): void;
}
