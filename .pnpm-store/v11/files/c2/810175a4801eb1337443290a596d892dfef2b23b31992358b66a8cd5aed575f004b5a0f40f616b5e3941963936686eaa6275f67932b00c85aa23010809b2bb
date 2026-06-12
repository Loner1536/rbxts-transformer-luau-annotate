-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
local useState = TS.import(script, TS.getModule(script, "@rbxts", "react")).useState
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local useEventListener = TS.import(script, script.Parent.Parent, "use-event-listener").useEventListener
--[[
	*
	 * Returns the current camera. Updates when the current camera changes.
	 * @returns A camera instance.
	 
]]
local function useCamera()
	local camera, setCamera = useState(Workspace.CurrentCamera)
	useEventListener(Workspace:GetPropertyChangedSignal("CurrentCamera"), function()
		if Workspace.CurrentCamera then
			setCamera(Workspace.CurrentCamera)
		end
	end)
	return camera
end
return {
	useCamera = useCamera,
}
