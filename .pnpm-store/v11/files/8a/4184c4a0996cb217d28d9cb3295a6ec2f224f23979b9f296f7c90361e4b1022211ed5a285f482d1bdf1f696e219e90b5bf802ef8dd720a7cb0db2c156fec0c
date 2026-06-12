-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useBinding = _react.useBinding
local useEffect = _react.useEffect
local useMemo = _react.useMemo
local createMotion = TS.import(script, TS.getModule(script, "@rbxts", "ripple").src).createMotion
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local callbacks = {}
local connection
local function connect(callback)
	local _callback = callback
	callbacks[_callback] = true
	if not connection then
		connection = RunService.Heartbeat:Connect(function(dt)
			for callback in callbacks do
				callback(dt)
			end
		end)
	end
end
local function disconnect(callback)
	local _callback = callback
	callbacks[_callback] = nil
	if next(callbacks) == nil then
		local _result = connection
		if _result ~= nil then
			_result:Disconnect()
		end
		connection = nil
	end
end
local function useMotion(initialValue)
	local motion = useMemo(function()
		return createMotion(initialValue)
	end, {})
	local binding, setValue = useBinding(initialValue)
	useEffect(function()
		local callback = function(delta)
			local value = motion:step(delta)
			if value ~= binding:getValue() then
				setValue(value)
			end
		end
		connect(callback)
		return function()
			return disconnect(callback)
		end
	end, {})
	return binding, motion
end
return {
	useMotion = useMotion,
}
