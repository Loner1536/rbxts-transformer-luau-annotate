-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useCallback = _react.useCallback
local useRef = _react.useRef
local useState = _react.useState
local useUnmountEffect = TS.import(script, script.Parent.Parent, "use-unmount-effect").useUnmountEffect
--[[
	*
	 * Returns a tuple containing the current state of the promise and a callback
	 * to start a new promise. Calling it will cancel any previous promise.
	 * @param callback The async callback.
	 * @returns The state and a new callback.
	 
]]
local function useAsyncCallback(callback)
	local currentPromise = useRef()
	local state, setState = useState({
		status = TS.Promise.Status.Started,
	})
	local execute = useCallback(function(...)
		local args = { ... }
		local _result = currentPromise.current
		if _result ~= nil then
			_result:cancel()
		end
		if state.status ~= TS.Promise.Status.Started then
			setState({
				status = TS.Promise.Status.Started,
			})
		end
		local promise = callback(unpack(args))
		promise:andThen(function(value)
			return setState({
				status = promise:getStatus(),
				value = value,
			})
		end, function(message)
			return setState({
				status = promise:getStatus(),
				message = message,
			})
		end)
		currentPromise.current = promise
		return currentPromise.current
	end, { callback })
	useUnmountEffect(function()
		local _result = currentPromise.current
		if _result ~= nil then
			_result:cancel()
		end
	end)
	return state, execute
end
return {
	useAsyncCallback = useAsyncCallback,
}
