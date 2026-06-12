-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local createRoot = TS.import(script, TS.getModule(script, "@rbxts", "react-roblox")).createRoot
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local React = _react
local StrictMode = _react.StrictMode
--[[
	*
	 * Returns a function that can be used as a Hoarcekat story. This function will
	 * mount the given component to the target instance and unmount it when the
	 * story is unmounted.
	 * @param TestComponent The component to mount.
	 * @param options Optional options to pass to `withHookDetection`.
	 * @returns A Hoarcekat story.
	 
]]
local function hoarcekat(TestComponent)
	return function(target)
		local root = createRoot(target)
		root:render(React.createElement(StrictMode, nil, React.createElement(TestComponent)))
		return function()
			root:unmount()
		end
	end
end
return {
	hoarcekat = hoarcekat,
}
