-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useCallback = _react.useCallback
local useState = _react.useState
--[[
	*
	 * Returns a function that can be used to force a component to update. The
	 * function is recreated on the next render if called. This makes it useful as
	 * a dependency for other hooks.
	 * @returns A function that forces a rerender.
	 
]]
local function useUpdate()
	local state, setState = useState({})
	return useCallback(function()
		setState({})
	end, { state })
end
return {
	useUpdate = useUpdate,
}
