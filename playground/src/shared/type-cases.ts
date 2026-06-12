//!native
// TYPE ANNOTATION TEST CASES
// After compiling, verify each function has the correct Luau annotation.
// Each function is named to describe what it tests.

import type { Connection, Group, Codec, Packet, Pool } from "@shared/type";

// ── Primitives ────────────────────────────────────────────────────────────

export function case_number(n: number): number {
    return n;
}
// expected: local function case_number(n: number): number

export function case_string(s: string): string {
    return s;
}
// expected: local function case_string(s: string): string

export function case_boolean(b: boolean): boolean {
    return b;
}
// expected: local function case_boolean(b: boolean): boolean

export function case_buffer(buf: buffer): buffer {
    return buf;
}
// expected: local function case_buffer(buf: buffer): buffer

// ── Optional parameters ───────────────────────────────────────────────────

export function case_optional_number(n?: number): number {
    return n ?? 0;
}
// expected: local function case_optional_number(n: number?): number

export function case_optional_string(s?: string): string {
    return s ?? "";
}
// expected: local function case_optional_string(s: string?): string

export function case_optional_player(p?: Player): string {
    return p?.Name ?? "";
}
// expected: local function case_optional_player(p: Player?): string

// ── Roblox types ──────────────────────────────────────────────────────────

export function case_vector3(v: Vector3): Vector3 {
    return v;
}
// expected: local function case_vector3(v: Vector3): Vector3

export function case_cframe(cf: CFrame): CFrame {
    return cf;
}
// expected: local function case_cframe(cf: CFrame): CFrame

export function case_player(p: Player): string {
    return p.Name;
}
// expected: local function case_player(p: Player): string

export function case_instance(i: Instance): string {
    return i.Name;
}
// expected: local function case_instance(i: Instance): string

// ── Collections ───────────────────────────────────────────────────────────

export function case_array_number(arr: number[]): number {
    let sum = 0;
    for (const v of arr) sum += v;
    return sum;
}
// expected: local function case_array_number(arr: {number}): number

export function case_array_player(arr: Player[]): number {
    return arr.size();
}
// expected: local function case_array_player(arr: {Player}): number

export function case_map_string_number(map: Map<string, number>, key: string): number {
    return map.get(key) ?? 0;
}
// expected: local function case_map_string_number(map: {[string]: number}, key: string): number

export function case_record(rec: Record<string, boolean>, key: string): boolean {
    return rec[key] ?? false;
}
// expected: local function case_record(rec: {[string]: boolean}, key: string): boolean

// ── Optional collections ──────────────────────────────────────────────────

export function case_optional_array(arr?: number[]): number {
    return arr?.size() ?? 0;
}
// expected: local function case_optional_array(arr: {number}?): number

// ── User-defined types ────────────────────────────────────────────────────

export function case_user_connection(conn: Connection): void {
    conn.Disconnect();
}
// expected: local function case_user_connection(conn: Connection)

export function case_user_group(group: Group): number {
    return group.members().size();
}
// expected: local function case_user_group(group: Group): number

export function case_user_pool_entry(entry: Pool.Entry): string {
    return `${entry.id}:${entry.name}`;
}
// expected: local function case_user_pool_entry(entry: Pool_Entry): string

// ── Generic user types ────────────────────────────────────────────────────

export function case_generic_codec(
    codec: Codec.Internal<number>,
    buf: buffer,
    offset: number,
): number {
    return codec.write(buf, offset, 42);
}
// expected: local function case_generic_codec(codec: Codec_Internal<number>, buf: buffer, offset: number): number

// ── Array of user types ───────────────────────────────────────────────────

export function case_array_of_user_type(conns: Connection[]): void {
    for (const conn of conns) conn.Disconnect();
}
// expected: local function case_array_of_user_type(conns: {Connection})

// ── Locals ────────────────────────────────────────────────────────────────

export function case_locals_primitive(n: number): number {
    const doubled = n * 2; // number literal inference
    const limit = 100; // number literal
    const flag = true; // boolean literal
    const name = "hello"; // string literal — but typed as "hello" not string
    return doubled > limit ? limit : doubled;
}
// expected locals: doubled: number, limit: number, flag: boolean

// ── Buffer operations (hot path) ──────────────────────────────────────────

export function case_buffer_readwrite(buf: buffer, offset: number, value: number): number {
    const old = buffer.readu8(buf, offset);
    buffer.writeu8(buf, offset, value);
    return old;
}
// expected: all params and local annotated
