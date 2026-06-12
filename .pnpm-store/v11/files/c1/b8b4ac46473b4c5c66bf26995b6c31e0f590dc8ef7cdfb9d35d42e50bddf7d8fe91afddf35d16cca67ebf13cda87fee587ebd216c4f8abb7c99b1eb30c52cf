-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
local useDebounceCallback = TS.import(script, script.Parent.Parent, "use-debounce-callback").useDebounceCallback
local useUpdate = TS.import(script, script.Parent.Parent, "use-update").useUpdate
local useUpdateEffect = TS.import(script, script.Parent.Parent, "use-update-effect").useUpdateEffect
--[[
	*
	 * Creates a debounced effect that delays invoking `effect` until after `wait`
	 * seconds have elapsed since the last time the debounced function was invoked.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `debounce` and `throttle`.
	 *
	 * @param effect The effect to debounce.
	 * @param dependencies The dependencies array.
	 * @param options The options object.
	 
]]
local function useDebounceEffect(effect, dependencies, options)
	local update = useUpdate()
	local _binding = useDebounceCallback(update, options)
	local run = _binding.run
	useEffect(function()
		return run()
	end, dependencies)
	useUpdateEffect(effect, { update })
end
return {
	useDebounceEffect = useDebounceEffect,
}
