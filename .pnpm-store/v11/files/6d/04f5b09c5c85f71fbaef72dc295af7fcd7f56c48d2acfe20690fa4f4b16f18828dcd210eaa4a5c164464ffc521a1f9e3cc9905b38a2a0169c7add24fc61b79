import { EventNetworkingEvents } from "../handlers";
import { ClientHandler, EventCreateConfiguration, NamespaceMetadata, ServerHandler } from "./types";
import { SignalContainer } from "../util/createSignalContainer";
import { EventInterface } from "../event/createEvent";
export declare function createGenericHandler<T extends ClientHandler<S, R> | ServerHandler<S, R>, S, R>(globalName: string, namespaceName: string | undefined, metadata: NamespaceMetadata<R, S>, config: EventCreateConfiguration<R>, signals: SignalContainer<EventNetworkingEvents>, method: (receiver: EventInterface, sender: EventInterface) => unknown): T;
