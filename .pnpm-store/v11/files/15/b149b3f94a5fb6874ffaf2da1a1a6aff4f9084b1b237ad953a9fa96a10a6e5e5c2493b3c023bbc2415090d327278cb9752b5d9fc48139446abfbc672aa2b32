/**
 * Wrapper around `CollectionService` that provides a list of `Instance` under the given `tag`.
 *
 * This list is updated as `Instance` are added and removed. You can also cast the `Instance` to the expected type.
 *
 * ```ts
 * const zombies = useTagged<ZombieModel>("zombie");
 * ```
 *
 * @param tag The `CollectionService` tag name to filter against.
 * @returns A stateful list of `Instance` matching the provided `tag`.
 * @template T An optional subtype of `Instance` to cast the tagged children to.
 */
export declare function useTagged<T extends Instance = Instance>(tag: string): readonly T[];
