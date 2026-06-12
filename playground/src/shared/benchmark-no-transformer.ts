// plain VM baseline

function lerp(a: number, b: number, t: number): number {
    const range = b - a;
    return a + range * t;
}

function pack(a: number, b: number, c: number, d: number): number {
    return bit32.bor(
        bit32.band(a, 0xff),
        bit32.lshift(bit32.band(b, 0xff), 8),
        bit32.lshift(bit32.band(c, 0xff), 16),
        bit32.lshift(bit32.band(d, 0xff), 24),
    );
}

function sumArray(arr: number[]): number {
    let total = 0;
    for (const v of arr) total += v;
    return total;
}

function mapLookup(map: Map<string, number>, key: string): number {
    return map.get(key) ?? 0;
}

function encodeVarUint(buf: buffer, offset: number, value: number): number {
    let pos = offset;
    while (true) {
        const byte = bit32.band(value, 0x7f);
        value = bit32.rshift(value, 7);
        if (value === 0) {
            buffer.writeu8(buf, pos, byte);
            pos += 1;
            break;
        }
        buffer.writeu8(buf, pos, bit32.bor(byte, 0x80));
        pos += 1;
    }
    return pos;
}

function decodeVarUint(buf: buffer, offset: number): LuaTuple<[number, number]> {
    let result = 0;
    let shift = 0;
    let pos = offset;
    while (true) {
        const byte = buffer.readu8(buf, pos);
        pos += 1;
        result = bit32.bor(result, bit32.lshift(bit32.band(byte, 0x7f), shift));
        shift += 7;
        if (bit32.band(byte, 0x80) === 0) break;
    }
    return $tuple(result, pos);
}

const ITERATIONS = 1_000_000;

export function runUnannotatedBenchmark(): void {
    let t = os.clock();
    for (let i = 0; i < ITERATIONS; i++) lerp(1, 100, 0.5);
    print(string.format("  [no-native]    lerp:          %.4fms", (os.clock() - t) * 1000));

    t = os.clock();
    for (let i = 0; i < ITERATIONS; i++) pack(10, 20, 30, 40);
    print(string.format("  [no-native]    pack:          %.4fms", (os.clock() - t) * 1000));

    const arr: number[] = [];
    for (let i = 0; i < 100; i++) arr.push(i);
    t = os.clock();
    for (let i = 0; i < ITERATIONS / 100; i++) sumArray(arr);
    print(string.format("  [no-native]    sumArray(100): %.4fms", (os.clock() - t) * 1000));

    const map = new Map<string, number>([
        ["health", 100],
        ["mana", 50],
        ["stamina", 75],
    ]);
    t = os.clock();
    for (let i = 0; i < ITERATIONS; i++) mapLookup(map, "health");
    print(string.format("  [no-native]    mapLookup:     %.4fms", (os.clock() - t) * 1000));

    const buf = buffer.create(64);
    t = os.clock();
    for (let i = 0; i < ITERATIONS; i++) encodeVarUint(buf, 0, 12345);
    print(string.format("  [no-native]    encodeVarUint: %.4fms", (os.clock() - t) * 1000));

    t = os.clock();
    for (let i = 0; i < ITERATIONS; i++) decodeVarUint(buf, 0);
    print(string.format("  [no-native]    decodeVarUint: %.4fms", (os.clock() - t) * 1000));
}
