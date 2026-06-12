-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useEffect = TS.import(script, TS.getModule(script, "@rbxts", "react")).useEffect
local useLatest = TS.import(script, script.Parent.Parent, "use-latest").useLatest
--[[
	*
	 * Calls the callback when the component unmounts.
	 * @param callback The callback to call.
	 
]]
local function useUnmountEffect(callback)
	local callbackRef = useLatest(callback)
	useEffect(function()
		return function()
			callbackRef.current()
		end
	end, {})
end
return {
	useUnmountEffect = useUnmountEffect,
}
