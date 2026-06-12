import { FunctionNetworkingEvents } from "../handlers";
import { ClientHandler, FunctionCreateConfiguration, NamespaceMetadata, ServerHandler } from "./types";
import { SignalContainer } from "../util/createSignalContainer";
import { FunctionReceiverInterface } from "../function/createFunctionReceiver";
import { FunctionSenderInterface } from "../function/createFunctionSender";
export type MethodCreator = (config: FunctionCreateConfiguration<unknown>, receiver?: FunctionReceiverInterface, sender?: FunctionSenderInterface) => unknown;
export declare function createGenericHandler<T extends ClientHandler<S, R> | ServerHandler<S, R>, S, R>(globalName: string, namespaceName: string | undefined, receiverPrefix: string, senderPrefix: string, metadata: NamespaceMetadata<R, S>, config: FunctionCreateConfiguration<R>, signals: SignalContainer<FunctionNetworkingEvents>, createMethod: MethodCreator): T;
