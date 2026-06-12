-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useBinding = _react.useBinding
local useEffect = _react.useEffect
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local useEventListener = TS.import(script, script.Parent.Parent, "use-event-listener").useEventListener
--[[
	*
	 * Returns the lifetime of the component in seconds. Updates every frame on
	 * the Heartbeat event.
	 *
	 * If the dependency array is provided, the lifetime timer will reset when
	 * any of the dependencies change.
	 *
	 * @param dependencies An optional array of dependencies to reset the timer.
	 * @returns A binding of the component's lifetime.
	 
]]
local function useLifetime(dependencies)
	if dependencies == nil then
		dependencies = {}
	end
	local lifetime, setLifetime = useBinding(0)
	useEventListener(RunService.Heartbeat, function(deltaTime)
		setLifetime(lifetime:getValue() + deltaTime)
	end)
	useEffect(function()
		setLifetime(0)
	end, dependencies)
	return lifetime
end
return {
	useLifetime = useLifetime,
}
