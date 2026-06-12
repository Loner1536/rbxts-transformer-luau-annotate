-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useEffect = _react.useEffect
local useMemo = _react.useMemo
local useLatestCallback = TS.import(script, script.Parent.Parent, "use-latest-callback").useLatestCallback
local _binding = TS.import(script, script.Parent.Parent, "utils", "binding")
local getBindingApi = _binding.getBindingApi
local isBinding = _binding.isBinding
--[[
	*
	 * Subscribes to a binding and calls the given listener when the binding
	 * updates. If the value passed is not a binding, the listener will be called
	 * with the value.
	 *
	 * The `listener` function is safe to not be memoized, as it will only be
	 * called when the binding updates.
	 *
	 * @param binding The binding to subscribe to.
	 * @param listener The function to call when the binding updates.
	 
]]
local function useBindingListener(binding, listener)
	local api = useMemo(function()
		return if isBinding(binding) then getBindingApi(binding) else nil
	end, { binding })
	local listenerCallback = useLatestCallback(listener)
	useEffect(function()
		if api then
			listenerCallback(api.getValue())
			return api.subscribe(listenerCallback)
		else
			listenerCallback(binding)
		end
	end, { binding })
end
return {
	useBindingListener = useBindingListener,
}
