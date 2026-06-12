import { InferEnumNames } from "@rbxts/react";
/**
 * A single key code name.
 */
export type KeyCode = InferEnumNames<Enum.KeyCode>;
/**
 * A single key code or a combination of key codes.
 */
export type KeyCodes = KeyCode | `${KeyCode}+${string}` | KeyCode[];
export interface KeyPressOptions {
    /**
     * Whether to bind a ContextActionService action to the key press. If `true`,
     * the action will be bound with the lifecycle of the component. The action will
     * sink the input, so the game will not process it.
     */
    bindAction?: boolean;
    /**
     * The action priority to use when binding the action. Defaults to
     * `Enum.ContextActionPriority.High.Value`.
     */
    actionPriority?: number;
    /**
     * The action name to use when binding the action. Defaults to a random name.
     */
    actionName?: string;
    /**
     * The input types and key codes to listen for. Defaults to `Enum.UserInputType.Keyboard`
     * and `Enum.UserInputType.Gamepad1`.
     */
    actionInputTypes?: (Enum.UserInputType | Enum.KeyCode)[];
}
/**
 * Returns whether the passed key or shortcut is pressed. The hook expects one
 * or more key code, which can be:
 *
 * - A single key code `"W"`
 * - A combination of key codes `"W+Space"`
 * - An array of key codes `["W", "Space"]`
 *
 * Each combination is treated as its own shortcut. If passed more than one
 * combination, the hook will return `true` if any of the combinations are
 * pressed.
 *
 * @param keyCodeCombos The key code or combination of key codes to listen for.
 * @returns Whether the key or combination of keys is pressed.
 */
export declare function useKeyPress(keyCodeCombos: KeyCodes[], { bindAction, actionPriority, actionName, actionInputTypes, }?: KeyPressOptions): boolean;
