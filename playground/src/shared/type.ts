// Type definitions used by the benchmark
// These are intentionally similar to TypeNet's type.ts

export type Connection = {
    Disconnect(): void;
};

export type Group = {
    add(player: Player): void;
    remove(player: Player): void;
    has(player: Player): boolean;
    members(): Player[];
};

export namespace Codec {
    export type Internal<T> = {
        write(buf: buffer, offset: number, value: T): number;
        read(buf: buffer, offset: number): LuaTuple<[T, number]>;
        _size?: number;
        _delta?: boolean;
    };
}

export namespace Packet {
    export type Builder = {
        to(target: Player | Player[] | Group): Builder;
        except(target: Player | Player[]): Builder;
        after(seconds: number): Builder;
    };

    export type Object<T> = T extends undefined
        ? {
            fire(): Builder;
            broadcast(): Builder;
            connect(handler: (player: Player) => void): Connection;
            once(handler: (player: Player) => void): Connection;
        }
        : {
            fire(data: T): Builder;
            broadcast(data: T): Builder;
            connect(handler: (data: T, player: Player) => void): Connection;
            once(handler: (data: T, player: Player) => void): Connection;
        };
}

export namespace Pool {
    export type Entry = {
        id: number;
        name: string;
        handler?: (data: unknown, player: Player) => void;
    };
}
