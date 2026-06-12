export type Connection = {
    Disconnect(): void;
};

export type Group = {
    add(player: Player): void;
    remove(player: Player): void;
    has(player: Player): boolean;
    members(): Player[];
};

export namespace Queue {
    export type Entry = {
        id: number;
        data: unknown;
        target?: Player | Player[];
        exclude?: Player | Player[];
        delay?: number;
    };

    export type PooledBuilder = Packet.Builder & {
        _entry: Queue.Entry;
    };
}

export namespace Codec {
    export type Internal<T> = {
        write(buf: buffer, offset: number, value: T): number;
        read(buf: buffer, offset: number): LuaTuple<[T, number]>;
        _size?: number;
        _delta?: boolean;
    };
}

export namespace Channel {
    export type Definition = Packet.Definition<any>;

    export type Result<T extends Record<string, Definition>> = {
        [K in keyof T]: T[K] extends Packet.Definition<infer D> ? Packet.Object<D> : never;
    };
}

export namespace Packet {
    export type Definition<T> = {
        codec: Codec.Internal<T>;
        _kind: "Packet";
    };

    export type Builder = {
        except(target: Player | Player[]): Builder;
        to(target: Player[] | Group): Builder;
        after(seconds: number): Builder;
    };

    export type Object<T> = {
        fire: T extends void ? () => Builder : (data: T) => Builder;
        broadcast: T extends void ? () => Builder : (data: T) => Builder;

        connect(
            handler: T extends void ? (player: Player) => void : (data: T, player: Player) => void,
        ): Connection;

        once(
            handler: T extends void ? (player: Player) => void : (data: T, player: Player) => void,
        ): Connection;
    };
}

export namespace Query {
    export type Definition<TReq, TRes> = {
        request: Codec.Internal<TReq>;
        response: Codec.Internal<TRes>;

        _kind: "Query";
    };
}

export namespace Pool {
    export type Handler<T> = (data: T, player: Player) => void;

    export type Entry = {
        id: number;
        name: string;
        codec: Codec.Internal<unknown>;
        handler?: Pool.Handler<unknown>;
    };
}

export namespace Bridge {
    export type Entry = {
        id: number;
        name: string;
    };
}
