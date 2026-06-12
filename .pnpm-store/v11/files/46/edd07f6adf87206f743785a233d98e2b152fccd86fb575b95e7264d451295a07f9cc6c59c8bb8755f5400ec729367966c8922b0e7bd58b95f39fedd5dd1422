export interface SignalContainer<T> {
    fire<K extends keyof T>(name: K, ...args: Parameters<T[K]>): void;
    connect<K extends keyof T>(name: K, callback: T[K]): RBXScriptConnection;
}
export declare function createSignalContainer<T>(): SignalContainer<T>;
