-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
local useDeferCallback = TS.import(script, script.Parent.Parent, "use-defer-callback").useDeferCallback
--[[
	*
	 * Like `useEffect`, but the callback is deferred to the next Heartbeat frame.
	 * @param callback The callback to run
	 * @param dependencies Optional dependencies to trigger the effect
	 
]]
local function useDeferEffect(callback, dependencies)
	local deferredCallback, cancel = useDeferCallback(callback)
	useEffect(function()
		deferredCallback()
		return cancel
	end, dependencies)
end
return {
	useDeferEffect = useDeferEffect,
}
