-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useSpring = TS.import(script, script.Parent, "use-spring").useSpring
return function()
	it("should return a binding", function()
		local _binding = renderHook(function()
			return useSpring(0)
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current:getValue()).to.be.a("number")
		expect(result.current:getValue()).to.equal(0)
		unmount()
	end)
end
