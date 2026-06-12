-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useCallback = _react.useCallback
local useRef = _react.useRef
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local useLatest = TS.import(script, script.Parent.Parent, "use-latest").useLatest
--[[
	*
	 * Defers a callback to be executed on the next Heartbeat frame. Consecutive
	 * calls to the returned `execute` function will cancel the previous call.
	 * @param callback The callback to defer
	 * @returns A tuple containing the `execute` and `cancel` functions
	 
]]
local function useDeferCallback(callback)
	local callbackRef = useLatest(callback)
	local connectionRef = useRef()
	local cancel = useCallback(function()
		local _result = connectionRef.current
		if _result ~= nil then
			_result:Disconnect()
		end
		connectionRef.current = nil
	end, {})
	local execute = useCallback(function(...)
		local args = { ... }
		cancel()
		connectionRef.current = RunService.Heartbeat:Once(function()
			connectionRef.current = nil
			callbackRef.current(unpack(args))
		end)
	end, {})
	return execute, cancel
end
return {
	useDeferCallback = useDeferCallback,
}
