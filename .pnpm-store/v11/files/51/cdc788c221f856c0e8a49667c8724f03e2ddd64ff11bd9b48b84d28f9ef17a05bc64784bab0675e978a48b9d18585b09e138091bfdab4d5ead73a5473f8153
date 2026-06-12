-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useMountEffect = TS.import(script, script.Parent, "use-mount-effect").useMountEffect
return function()
	it("should run callback on mount", function()
		local renders = 0
		local mounted = false
		local _binding = renderHook(function()
			useMountEffect(function()
				mounted = not mounted
			end)
			renders += 1
		end)
		local rerender = _binding.rerender
		expect(renders).to.equal(1)
		expect(mounted).to.equal(true)
		rerender()
		expect(renders).to.equal(2)
		expect(mounted).to.equal(true)
	end)
end
