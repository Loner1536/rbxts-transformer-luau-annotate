-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useCallback = _react.useCallback
local useEffect = _react.useEffect
local useRef = _react.useRef
local setInterval = TS.import(script, TS.getModule(script, "@rbxts", "set-timeout").out).setInterval
local useLatestCallback = TS.import(script, script.Parent.Parent, "use-latest-callback").useLatestCallback
--[[
	*
	 * Sets an interval that runs the callback function every `delay` seconds. If
	 * `delay` is `undefined`, the interval is cleared. If the delay changes, the
	 * interval is reset.
	 * @param callback The callback function to run.
	 * @param delay The delay in seconds between each interval.
	 * @param options The options for the interval.
	 * @returns A function that clears the interval.
	 
]]
local function useInterval(callback, delay, options)
	if options == nil then
		options = {}
	end
	local _binding = options
	local immediate = _binding.immediate
	if immediate == nil then
		immediate = false
	end
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
		if immediate then
			callbackMemo()
		end
		cancel.current = setInterval(callbackMemo, delay)
		return clear
	end, { delay })
	return clear
end
return {
	useInterval = useInterval,
}
