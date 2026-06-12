-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local UserInputService = TS.import(script, TS.getModule(script, "@rbxts", "services")).UserInputService
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useMouse = TS.import(script, script.Parent, "use-mouse").useMouse
return function()
	it("should return a binding to the mouse position", function()
		local _binding = renderHook(function()
			return useMouse()
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current).to.be.a("table")
		expect(result.current:getValue()).to.be.a("userdata")
		expect(result.current:getValue()).to.equal(UserInputService:GetMouseLocation())
		unmount()
	end)
	it("should receive an optional listener", function()
		local mouse = Vector2.new(-1, -1)
		local _binding = renderHook(function()
			return useMouse(function(m)
				mouse = m
				return mouse
			end)
		end)
		local unmount = _binding.unmount
		expect(mouse).never.to.equal(Vector2.new(-1, -1))
		expect(mouse).to.equal(UserInputService:GetMouseLocation())
		unmount()
	end)
end
