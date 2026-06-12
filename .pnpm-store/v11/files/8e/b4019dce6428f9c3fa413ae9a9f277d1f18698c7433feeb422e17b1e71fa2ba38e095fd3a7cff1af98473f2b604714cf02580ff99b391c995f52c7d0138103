-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useCallback = _react.useCallback
local useState = _react.useState
local useDeferCallback = TS.import(script, script.Parent.Parent, "use-defer-callback").useDeferCallback
local useLatest = TS.import(script, script.Parent.Parent, "use-latest").useLatest
local useUnmountEffect = TS.import(script, script.Parent.Parent, "use-unmount-effect").useUnmountEffect
local resolve = function(value, state)
	local _value = value
	return if type(_value) == "function" then value(state) else value
end
--[[
	*
	 * Like `useState`, but `setState` will update the state on the next Heartbeat
	 * frame. Only the latest update in a frame will run.
	 *
	 * This is useful for improving performance when updating state in response to
	 * events that fire rapidly in succession.
	 *
	 * @param initialState Optional initial state
	 * @returns A tuple containing the state and a function to update it
	 
]]
local function useDeferState(initialState)
	local state, innerSetState = useState(initialState)
	local deferredSetState, cancel = useDeferCallback(innerSetState)
	local latestState = useLatest(state)
	-- Wrap 'deferState' to allow multiple changes to state in one frame through
	-- the `latestState` reference
	local setState = useCallback(function(value)
		latestState.current = resolve(value, latestState.current)
		deferredSetState(latestState.current)
	end, {})
	useUnmountEffect(cancel)
	return state, setState
end
return {
	useDeferState = useDeferState,
}
