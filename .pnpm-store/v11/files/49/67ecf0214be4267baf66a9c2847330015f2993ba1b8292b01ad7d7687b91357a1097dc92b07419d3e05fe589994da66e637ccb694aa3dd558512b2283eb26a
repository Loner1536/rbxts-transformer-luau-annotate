-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useState = TS.import(script, TS.getModule(script, "@rbxts", "react")).useState
local useDebounceCallback = TS.import(script, script.Parent.Parent, "use-debounce-callback").useDebounceCallback
--[[
	*
	 * Delays updating `state` until after `wait` seconds have elapsed since the
	 * last time the debounced function was invoked. Set to the most recently passed
	 * `state` after the delay.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `debounce` and `throttle`.
	 *
	 * @param initialState The value to debounce.
	 * @param options The options object.
	 * @returns A tuple containing the debounced value and a function to update it.
	 
]]
local function useDebounceState(initialState, options)
	local state, setState = useState(initialState)
	return state, useDebounceCallback(setState, options).run
end
return {
	useDebounceState = useDebounceState,
}
