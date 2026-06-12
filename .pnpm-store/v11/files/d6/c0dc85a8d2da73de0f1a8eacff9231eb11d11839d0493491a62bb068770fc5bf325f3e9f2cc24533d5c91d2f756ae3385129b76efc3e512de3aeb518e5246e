import { EventInterface } from "../event/createEvent";
export declare function createServerMethod(receiver: EventInterface, sender: EventInterface): {
    fire: (players: Player | Player[], ...args: unknown[]) => void;
    except: (players: Player | Player[], ...args: unknown[]) => void;
    broadcast: (...args: unknown[]) => void;
    connect: (cb: (player: Player, ...args: unknown[]) => void) => RBXScriptConnection;
    predict: (player: Player, ...args: unknown[]) => void;
};
