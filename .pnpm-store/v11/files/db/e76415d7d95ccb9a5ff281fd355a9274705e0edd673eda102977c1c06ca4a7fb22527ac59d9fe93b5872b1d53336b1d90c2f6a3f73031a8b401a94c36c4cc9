-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local _react = TS.import(script, TS.getModule(script, "@rbxts", "react"))
local useBinding = _react.useBinding
local useMemo = _react.useMemo
local UserInputService = TS.import(script, TS.getModule(script, "@rbxts", "services")).UserInputService
local useEventListener = TS.import(script, script.Parent.Parent, "use-event-listener").useEventListener
local useMountEffect = TS.import(script, script.Parent.Parent, "use-mount-effect").useMountEffect
--[[
	*
	 * Returns a binding to the mouse position.
	 * @param listener Optional listener to be called when the mouse position changes.
	 * @returns A binding to mouse position.
	 
]]
local function useMouse(listener)
	local mouse, setMouse = useBinding(Vector2.one)
	useEventListener(UserInputService.InputChanged, function(input)
		if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
			setMouse(UserInputService:GetMouseLocation())
			local _result = listener
			if _result ~= nil then
				_result(UserInputService:GetMouseLocation())
			end
		end
	end)
	useMemo(function()
		setMouse(UserInputService:GetMouseLocation())
	end, {})
	useMountEffect(function()
		local _result = listener
		if _result ~= nil then
			_result(mouse:getValue())
		end
	end)
	return mouse
end
return {
	useMouse = useMouse,
}
