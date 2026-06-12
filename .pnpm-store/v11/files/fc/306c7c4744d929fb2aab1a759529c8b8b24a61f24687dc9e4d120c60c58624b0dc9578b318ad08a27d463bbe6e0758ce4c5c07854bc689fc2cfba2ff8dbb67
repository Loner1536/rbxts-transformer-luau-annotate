import { FunctionReceiverInterface } from "../function/createFunctionReceiver";
import { FunctionSenderInterface } from "../function/createFunctionSender";
import { FunctionCreateConfiguration } from "./types";
export declare function createClientMethod(config: FunctionCreateConfiguration<unknown>, receiver?: FunctionReceiverInterface, sender?: FunctionSenderInterface): {
    invoke: (...args: unknown[]) => Promise<unknown>;
    invokeWithTimeout: (timeout: number, ...args: unknown[]) => Promise<unknown>;
    setCallback: (callback: (...args: unknown[]) => unknown | Promise<unknown>) => void;
    predict: (...args: unknown[]) => Promise<unknown>;
};
