-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useUpdateEffect = TS.import(script, script.Parent, "use-update-effect").useUpdateEffect
return function()
	it("should call effect on update only", function()
		local renders = 0
		local _binding = renderHook(function()
			return useUpdateEffect(function()
				renders += 1
			end)
		end)
		local rerender = _binding.rerender
		expect(renders).to.equal(0)
		rerender()
		expect(renders).to.equal(1)
	end)
	it("should call effect with dependencies", function()
		local renders = 0
		local _binding = renderHook(function(value)
			return useUpdateEffect(function()
				renders += 1
			end, { value })
		end)
		local rerender = _binding.rerender
		expect(renders).to.equal(0)
		rerender("test")
		expect(renders).to.equal(1)
		rerender("test")
		expect(renders).to.equal(1)
		rerender("test2")
		expect(renders).to.equal(2)
	end)
end
