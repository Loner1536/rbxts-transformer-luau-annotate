-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local _services = TS.import(script, TS.getModule(script, "@rbxts", "services"))
local RunService = _services.RunService
local Workspace = _services.Workspace
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useCamera = TS.import(script, script.Parent, "use-camera").useCamera
return function()
	it("should return current camera", function()
		local _binding = renderHook(function()
			return useCamera()
		end)
		local result = _binding.result
		expect(result.current).to.equal(Workspace.CurrentCamera)
	end)
	it("should update when current camera changes", function()
		local _binding = renderHook(function()
			return useCamera()
		end)
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current).to.equal(Workspace.CurrentCamera)
		local _result = Workspace.CurrentCamera
		if _result ~= nil then
			_result:Destroy()
		end
		RunService.Heartbeat:Wait()
		rerender()
		expect(result.current).to.equal(Workspace.CurrentCamera)
	end)
end
