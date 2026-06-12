-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
local useThrottleCallback = TS.import(script, script.Parent.Parent, "use-throttle-callback").useThrottleCallback
local useUpdate = TS.import(script, script.Parent.Parent, "use-update").useUpdate
local useUpdateEffect = TS.import(script, script.Parent.Parent, "use-update-effect").useUpdateEffect
--[[
	*
	 * Creates a throttled effect that only runs at most once per every `wait`
	 * seconds.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `debounce` and `throttle`.
	 *
	 * @param effect The effect to throttle.
	 * @param dependencies The dependencies array.
	 * @param options The options object.
	 
]]
local function useThrottleEffect(effect, dependencies, options)
	local update = useUpdate()
	local _binding = useThrottleCallback(update, options)
	local run = _binding.run
	useEffect(function()
		return run()
	end, dependencies)
	useUpdateEffect(effect, { update })
end
return {
	useThrottleEffect = useThrottleEffect,
}
