-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useCallback = _react.useCallback
local useEffect = _react.useEffect
local useRef = _react.useRef
local setTimeout = TS.import(script, TS.getModule(script, "@rbxts", "set-timeout").out).setTimeout
local useLatestCallback = TS.import(script, script.Parent.Parent, "use-latest-callback").useLatestCallback
--[[
	*
	 * Sets a timeout that runs the callback function after `delay` seconds. If
	 * `delay` is `undefined`, the timeout is cleared. If the delay changes, the
	 * timeout is reset.
	 * @param callback The callback function to run.
	 * @param delay The delay in seconds before the timeout.
	 * @returns A function that clears the timeout.
	 
]]
local function useTimeout(callback, delay)
	local callbackMemo = useLatestCallback(callback)
	local cancel = useRef()
	local clear = useCallback(function()
		local _result = cancel.current
		if _result ~= nil then
			_result()
		end
	end, {})
	useEffect(function()
		if delay == nil then
			return nil
		end
		cancel.current = setTimeout(callbackMemo, delay)
		return clear
	end, { delay })
	return clear
end
return {
	useTimeout = useTimeout,
}
