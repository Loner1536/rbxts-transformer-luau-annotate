-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useState = TS.import(script, TS.getModule(script, "@rbxts", "react")).useState
local useBindingListener = TS.import(script, script.Parent.Parent, "use-binding-listener").useBindingListener
local getBindingValue = TS.import(script, script.Parent.Parent, "utils", "binding").getBindingValue
--[[
	*
	 * Returns the value of a binding. If the binding updates, the component will
	 * be re-rendered. Non-binding values will be returned as-is.
	 * @param binding The binding to get the value of.
	 * @returns The value of the binding.
	 
]]
local function useBindingState(binding)
	local value, setValue = useState(function()
		return getBindingValue(binding)
	end)
	useBindingListener(binding, setValue)
	return value
end
return {
	useBindingState = useBindingState,
}
