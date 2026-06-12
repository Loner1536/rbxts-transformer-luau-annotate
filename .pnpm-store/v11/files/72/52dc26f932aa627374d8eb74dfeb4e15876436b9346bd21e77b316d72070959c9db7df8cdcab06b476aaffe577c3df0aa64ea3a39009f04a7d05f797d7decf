-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useMemo = TS.import(script, TS.getModule(script, "@rbxts", "react")).useMemo
local debounce = TS.import(script, TS.getModule(script, "@rbxts", "set-timeout").out).debounce
local useLatest = TS.import(script, script.Parent.Parent, "use-latest").useLatest
local useUnmountEffect = TS.import(script, script.Parent.Parent, "use-unmount-effect").useUnmountEffect
--[[
	*
	 * Creates a debounced function that delays invoking `callback` until after `wait`
	 * seconds have elapsed since the last time the debounced function was invoked.
	 * The `callback` is invoked with the last arguments provided to the debounced
	 * function. Subsequent calls to the debounced function return the result of
	 * the last `callback` invocation.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `debounce` and `throttle`.
	 *
	 * @param callback The function to debounce.
	 * @param options The options object.
	 * @returns The new debounced function.
	 
]]
local function useDebounceCallback(callback, options)
	if options == nil then
		options = {}
	end
	local callbackRef = useLatest(callback)
	local debounced = useMemo(function()
		return debounce(function(...)
			local args = { ... }
			return callbackRef.current(unpack(args))
		end, options.wait, options)
	end, {})
	useUnmountEffect(function()
		debounced.cancel()
	end)
	return {
		run = debounced,
		cancel = debounced.cancel,
		flush = debounced.flush,
		pending = debounced.pending,
	}
end
return {
	useDebounceCallback = useDebounceCallback,
}
