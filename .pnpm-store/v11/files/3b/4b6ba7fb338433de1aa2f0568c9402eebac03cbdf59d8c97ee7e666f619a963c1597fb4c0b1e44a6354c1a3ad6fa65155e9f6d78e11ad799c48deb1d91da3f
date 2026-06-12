-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useMemo = TS.import(script, TS.getModule(script, "@rbxts", "react")).useMemo
local throttle = TS.import(script, TS.getModule(script, "@rbxts", "set-timeout").out).throttle
local useLatest = TS.import(script, script.Parent.Parent, "use-latest").useLatest
local useUnmountEffect = TS.import(script, script.Parent.Parent, "use-unmount-effect").useUnmountEffect
--[[
	*
	 * Creates a throttled function that only invokes `callback` at most once per
	 * every `wait` seconds. The `callback` is invoked with the most recent arguments
	 * provided to the throttled function. Subsequent calls to the throttled function
	 * return the result of the last `callback` invocation.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `throttle` and `debounce`.
	 *
	 * @param callback The function to throttle.
	 * @param options The options object.
	 * @returns The new throttled function.
	 
]]
local function useThrottleCallback(callback, options)
	if options == nil then
		options = {}
	end
	local callbackRef = useLatest(callback)
	local throttled = useMemo(function()
		return throttle(function(...)
			local args = { ... }
			return callbackRef.current(unpack(args))
		end, options.wait, options)
	end, {})
	useUnmountEffect(function()
		throttled.cancel()
	end)
	return {
		run = throttled,
		cancel = throttled.cancel,
		flush = throttled.flush,
		pending = throttled.pending,
	}
end
return {
	useThrottleCallback = useThrottleCallback,
}
