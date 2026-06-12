-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useState = TS.import(script, TS.getModule(script, "@rbxts", "react")).useState
local useThrottleCallback = TS.import(script, script.Parent.Parent, "use-throttle-callback").useThrottleCallback
--[[
	*
	 * Creates a throttled state that only updates at most once per every `wait`
	 * seconds. Set to the most recently passed `state` after each interval.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `debounce` and `throttle`.
	 *
	 * @param value The value to throttle.
	 * @param options The options object.
	 * @returns The throttled value.
	 
]]
local function useThrottleState(initialState, options)
	local state, setState = useState(initialState)
	return state, useThrottleCallback(setState, options).run
end
return {
	useThrottleState = useThrottleState,
}
