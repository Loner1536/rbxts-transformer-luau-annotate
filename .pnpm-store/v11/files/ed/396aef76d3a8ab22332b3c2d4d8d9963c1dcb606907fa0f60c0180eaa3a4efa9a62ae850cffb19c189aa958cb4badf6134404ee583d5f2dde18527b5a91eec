import { FunctionReceiverInterface } from "../function/createFunctionReceiver";
import { FunctionSenderInterface } from "../function/createFunctionSender";
import { FunctionCreateConfiguration } from "./types";
export declare function createServerMethod(config: FunctionCreateConfiguration<unknown>, receiver?: FunctionReceiverInterface, sender?: FunctionSenderInterface): {
    invoke: (player: Player, ...args: unknown[]) => Promise<unknown>;
    invokeWithTimeout: (player: Player, timeout: number, ...args: unknown[]) => Promise<unknown>;
    setCallback: (callback: (player: Player, ...args: unknown[]) => unknown | Promise<unknown>) => void;
    predict: (player: Player, ...args: unknown[]) => Promise<unknown>;
};
