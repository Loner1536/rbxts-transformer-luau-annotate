import { EventCreateConfiguration } from "../events/types";
import { FunctionCreateConfiguration } from "../functions/types";
type ConfigType = EventCreateConfiguration<unknown> | FunctionCreateConfiguration<unknown>;
/**
 * Creates a new config with the namespace's middleware at the top level.
 */
export declare function getNamespaceConfig<T extends ConfigType>(config: T, namespaceId: string): T & {
    middleware: never;
};
export {};
