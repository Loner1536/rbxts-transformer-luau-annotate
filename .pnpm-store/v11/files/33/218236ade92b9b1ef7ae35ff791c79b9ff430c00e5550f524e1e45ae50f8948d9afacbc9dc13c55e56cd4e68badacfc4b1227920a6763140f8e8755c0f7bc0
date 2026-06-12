-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useRef = TS.import(script, TS.getModule(script, "@rbxts", "react")).useRef
local useMotion = TS.import(script, script.Parent.Parent, "use-motion").useMotion
local getBindingValue = TS.import(script, script.Parent.Parent, "utils", "binding").getBindingValue
local useEventListener = TS.import(script, script.Parent.Parent, "use-event-listener").useEventListener
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local function useSpring(goal, options)
	local binding, motion = useMotion(getBindingValue(goal))
	local previousValue = useRef(getBindingValue(goal))
	useEventListener(RunService.Heartbeat, function()
		local currentValue = getBindingValue(goal)
		if currentValue ~= previousValue.current then
			previousValue.current = currentValue
			motion:spring(currentValue, options)
		end
	end)
	return binding
end
return {
	useSpring = useSpring,
}
