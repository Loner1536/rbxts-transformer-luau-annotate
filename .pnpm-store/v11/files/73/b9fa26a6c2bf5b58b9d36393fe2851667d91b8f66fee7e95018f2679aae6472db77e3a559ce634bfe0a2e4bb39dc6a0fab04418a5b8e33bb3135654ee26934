-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useMotion = TS.import(script, script.Parent, "use-motion").useMotion
return function()
	it("should return a motor", function()
		local _binding = renderHook(function()
			local value, motion = useMotion(0)
			return {
				value = value,
				motion = motion,
			}
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current.value:getValue()).to.be.a("number")
		expect(result.current.value:getValue()).to.equal(0)
		expect(result.current.motion).to.be.a("table")
		unmount()
	end)
end
