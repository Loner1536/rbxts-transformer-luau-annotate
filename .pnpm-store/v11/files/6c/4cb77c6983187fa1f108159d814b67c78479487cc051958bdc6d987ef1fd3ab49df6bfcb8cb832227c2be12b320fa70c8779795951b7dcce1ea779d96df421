-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useEffect = _react.useEffect
local useRef = _react.useRef
--[[
	*
	 * Runs a callback when the component is re-rendered. Does not run on the
	 * first render.
	 * @param effect The callback to run.
	 * @param dependencies The dependencies to watch for changes.
	 
]]
local function useUpdateEffect(effect, dependencies)
	local isMounted = useRef(false)
	useEffect(function()
		if isMounted.current then
			return effect()
		else
			isMounted.current = true
		end
	end, dependencies)
end
return {
	useUpdateEffect = useUpdateEffect,
}
