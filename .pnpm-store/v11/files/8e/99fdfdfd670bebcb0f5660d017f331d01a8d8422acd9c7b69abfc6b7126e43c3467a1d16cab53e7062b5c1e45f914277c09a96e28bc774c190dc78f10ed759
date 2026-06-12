import { t } from "@rbxts/t";
import { MiddlewareFactory } from "./types";
import { SignalContainer } from "../util/createSignalContainer";
import { EventNetworkingEvents } from "../handlers";
import { NetworkInfo } from "../types";
export declare function createGuardMiddleware<I extends unknown[], O>(name: string, fixedParameters: t.check<unknown>[], restParameter: t.check<unknown> | undefined, networkInfo: NetworkInfo, warnOnInvalid: boolean, signals: SignalContainer<EventNetworkingEvents>, failureValue?: O): MiddlewareFactory<I, O>;
