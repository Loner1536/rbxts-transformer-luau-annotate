-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useBinding = _react.useBinding
local useEffect = _react.useEffect
local useCamera = TS.import(script, script.Parent.Parent, "use-camera").useCamera
--[[
	*
	 * Returns the current viewport size of the camera.
	 * @param listener Optional listener to be called when the viewport changes.
	 * @returns A binding to the viewport size.
	 
]]
local function useViewport(listener)
	local camera = useCamera()
	local viewport, setViewport = useBinding(camera.ViewportSize)
	useEffect(function()
		local connection = camera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
			setViewport(camera.ViewportSize)
			local _result = listener
			if _result ~= nil then
				_result(camera.ViewportSize)
			end
		end)
		setViewport(camera.ViewportSize)
		local _result = listener
		if _result ~= nil then
			_result(camera.ViewportSize)
		end
		return function()
			connection:Disconnect()
		end
	end, { camera })
	return viewport
end
return {
	useViewport = useViewport,
}
