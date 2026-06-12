-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local Workspace = TS.import(script, TS.getModule(script, "@rbxts", "services")).Workspace
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useViewport = TS.import(script, script.Parent, "use-viewport").useViewport
return function()
	it("should return a binding to the viewport size", function()
		local _binding = renderHook(function()
			return useViewport()
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current).to.be.a("table")
		expect(result.current:getValue()).to.be.a("userdata")
		expect(result.current:getValue()).to.equal(Workspace.CurrentCamera.ViewportSize)
		unmount()
	end)
	it("should receive an optional listener", function()
		local viewport = Vector2.new(-1, -1)
		local _binding = renderHook(function()
			return useViewport(function(v)
				viewport = v
				return viewport
			end)
		end)
		local unmount = _binding.unmount
		expect(viewport).never.to.equal(Vector2.new(-1, -1))
		expect(viewport).to.equal(Workspace.CurrentCamera.ViewportSize)
		unmount()
	end)
end
