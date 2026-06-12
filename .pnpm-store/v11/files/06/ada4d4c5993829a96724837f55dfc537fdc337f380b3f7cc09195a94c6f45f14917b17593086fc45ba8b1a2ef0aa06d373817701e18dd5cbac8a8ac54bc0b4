-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useBinding = _react.useBinding
local useCallback = _react.useCallback
local useRef = _react.useRef
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local useEventListener = TS.import(script, script.Parent.Parent, "use-event-listener").useEventListener
--[[
	*
	 * Creates a timer that can be used to track a value over time.
	 * @param initialValue The initial value of the timer.
	 * @returns A timer object.
	 
]]
local function useTimer(initialValue)
	if initialValue == nil then
		initialValue = 0
	end
	local value, setValue = useBinding(initialValue)
	local started = useRef(true)
	useEventListener(RunService.Heartbeat, function(deltaTime)
		if started.current then
			setValue(value:getValue() + deltaTime)
		end
	end)
	local start = useCallback(function()
		started.current = true
	end, {})
	local stop = useCallback(function()
		started.current = false
	end, {})
	local reset = useCallback(function()
		setValue(0)
	end, {})
	local set = useCallback(function(value)
		setValue(value)
	end, {})
	return {
		value = value,
		start = start,
		stop = stop,
		reset = reset,
		set = set,
	}
end
return {
	useTimer = useTimer,
}
