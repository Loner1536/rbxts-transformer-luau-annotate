# rbxts-transformer-luau-annotate

A roblox-ts TypeScript transformer that automatically adds Luau type annotations to `--!native` compiled output, enabling full native codegen optimization.

> ⚠️ **This project is in very early development.** Expect bugs, incomplete type coverage, and breaking changes. If you run into issues, please [open an issue](../../issues) — and PRs are very welcome!

## Why

Luau's `--!native` directive tells the VM to compile a module to native machine code. However, it can only generate optimal code when parameter, return, and local variable types are statically known. roblox-ts strips all type annotations during compilation — this transformer restores them automatically.

**Before:**
```lua
--!native
local function lerp(a, b, t)
    return a + (b - a) * t
end
```

**After:**
```lua
--!native
local function lerp(a: number, b: number, t: number): number
    return a + (b - a) * t
end
```

No manual Luau editing. No post-processing scripts. Just add the plugin and compile.

---

## Installation

```bash
npm install -D rbxts-transformer-luau-annotate
# or
pnpm add -D rbxts-transformer-luau-annotate
```

## Setup

Add to your `tsconfig.json`:

```json
{
    "compilerOptions": {
        "plugins": [
            {
                "transform": "rbxts-transformer-luau-annotate"
            }
        ]
    }
}
```

Only files containing `//!native` are processed. Files without it are skipped entirely.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `verbose` | `boolean` | `true` | Print annotated filenames to stderr |
| `typesOutput` | `string` | `"shared/__generated__"` | Output directory (relative to `outDir`) for generated user-defined type definitions |

```json
{
    "transform": "rbxts-transformer-luau-annotate",
    "verbose": false,
    "typesOutput": "shared/__generated__"
}
```

---

## What gets annotated

### Function parameters

```ts
//!native
export function damage(player: Player, amount: number, crit: boolean): void {
    // ...
}
```

```lua
local function damage(player: Player, amount: number, crit: boolean)
```

### Return types

```ts
//!native
export function pack(position: Vector3, rotation: CFrame): buffer {
    // ...
}
```

```lua
local function pack(position: Vector3, rotation: CFrame): buffer
```

### Local variables

```ts
//!native
export function process(input: number): number {
    const scale = 255;
    const offset = 0.5;
    const flag = true;
    // ...
}
```

```lua
local function process(input: number): number
    local scale: number = 255
    local offset: number = 0.5
    local flag: boolean = true
```

### Class methods

```ts
//!native
class Encoder {
    encode(data: buffer, length: number): buffer {
        // ...
    }
    setColor(color: Color3): void {
        // ...
    }
}
```

```lua
function Encoder:encode(data: buffer, length: number): buffer
function Encoder:setColor(color: Color3)
```

### User-defined types

Interfaces and type aliases referenced in annotated signatures are extracted and emitted into a generated Luau types module, which is automatically `require`d (via Rojo path resolution) in the annotated file.

```ts
//!native
export function getState(): PlayerState {
    // ...
}
```

```lua
local __luauAnnotateTypes = TS.import(script, game:GetService("ReplicatedStorage"), "TSShared", "__generated__", "generated.types")
local function getState(): __luauAnnotateTypes.PlayerState
```

---

## Supported types

| TypeScript | Luau |
|------------|------|
| `number` | `number` |
| `string` | `string` |
| `boolean` | `boolean` |
| `buffer` | `buffer` |
| `Vector3` | `Vector3` |
| `Vector2` | `Vector2` |
| `Vector3int16` | `Vector3int16` |
| `Vector2int16` | `Vector2int16` |
| `CFrame` | `CFrame` |
| `Color3` | `Color3` |
| `UDim` / `UDim2` | `UDim` / `UDim2` |
| `Player`, `Instance`, `BasePart`, etc. | matching Roblox types |
| `Array<T>` / `T[]` | `{T}` |
| `Map<K, V>` / `Record<K, V>` | `{[K]: V}` |
| `Set<T>` | `{[T]: boolean}` |
| `LuaTuple<[A, B]>` | `(A, B)` |
| Interfaces / type aliases | extracted into generated types module |

Numeric, string, and boolean literal types (`42`, `"hello"`, `true`) are mapped to their base types.

Unsupported or ambiguous types are left unannotated — the transformer skips them rather than emitting incorrect annotations.

---

## Watch mode

Watch mode (`rbxtsc -w`) is fully supported. Files are re-annotated automatically on each save.

```
[luau-annotate] annotated binary/encoder.luau
[luau-annotate] annotated shared/physics.luau
```

---

## Benchmarks

Measured on identical code, with and without the transformer (`--!native` requires static types to compile to native machine code; without this transformer the directive has little effect since roblox-ts strips all annotations).

| Function | Without (`no-native`) | With (`native+typed`) | Speedup |
|---|---|---|---|
| `lerp` | 2.2769ms | 2.3189ms | ~1.0x |
| `pack` | 2.2749ms | 2.2695ms | ~1.0x |
| `sumArray(100)` | 2.8516ms | 2.3736ms | ~1.2x |
| `mapLookup` | 4.3818ms | 2.3151ms | ~1.9x |
| `encodeVarUint` | 37.6953ms | 14.6217ms | ~2.6x |
| `decodeVarUint` | 51.1922ms | 19.1153ms | ~2.7x |

Gains scale with how arithmetic/branch-heavy the function is — simple functions like `lerp` and `pack` see negligible difference, while codec-style functions with tight loops and bit manipulation (`encodeVarUint`, `decodeVarUint`) see the largest wins from native codegen.

---

## Requirements

- roblox-ts `>=3.0.0`
- TypeScript `>=5.0.0`
- Node.js `>=18`

---

## Contributing

This is a very young project and there's a lot of room for improvement — more type coverage, better edge-case handling, and general robustness. If you find a bug, have a feature idea, or want to tackle a TODO, please open an issue or submit a pull request. All contributions are appreciated!
