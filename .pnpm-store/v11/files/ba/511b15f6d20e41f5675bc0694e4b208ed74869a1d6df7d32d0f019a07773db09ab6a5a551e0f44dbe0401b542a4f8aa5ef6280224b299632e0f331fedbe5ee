-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useCallback = _react.useCallback
local useRef = _react.useRef
--[[
	*
	 * Returns a memoized callback that wraps the latest version of the input
	 * callback.
	 * @param callback The callback to memoize.
	 * @returns The memoized callback.
	 
]]
local function useLatestCallback(callback)
	local callbackRef = useRef(callback)
	callbackRef.current = callback
	return useCallback(function(...)
		local args = { ... }
		return callbackRef.current(unpack(args))
	end, {})
end
return {
	useLatestCallback = useLatestCallback,
}
