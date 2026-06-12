import { Binding } from "@rbxts/react";
export interface Timer {
    /**
     * A binding that represents the current value of the timer.
     */
    readonly value: Binding<number>;
    /**
     * Starts the timer if it is not already running.
     */
    readonly start: () => void;
    /**
     * Pauses the timer if it is running.
     */
    readonly stop: () => void;
    /**
     * Resets the timer to 0.
     */
    readonly reset: () => void;
    /**
     * Sets the timer to a specific value.
     * @param value The value to set the timer to.
     */
    readonly set: (value: number) => void;
}
/**
 * Creates a timer that can be used to track a value over time.
 * @param initialValue The initial value of the timer.
 * @returns A timer object.
 */
export declare function useTimer(initialValue?: number): Timer;
