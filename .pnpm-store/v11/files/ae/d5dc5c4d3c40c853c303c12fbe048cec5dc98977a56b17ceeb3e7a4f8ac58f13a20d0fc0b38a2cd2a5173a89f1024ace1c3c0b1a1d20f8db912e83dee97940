-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useLifetime = TS.import(script, script.Parent, "use-lifetime").useLifetime
return function()
	it("should return the lifetime of the component", function()
		local _binding = renderHook(function()
			return useLifetime()
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current:getValue()).to.equal(0)
		local timePassed = task.wait(0.1)
		expect(result.current:getValue()).to.be:near(timePassed, 0.05)
		unmount()
	end)
	it("should reset when dependencies change", function()
		local _binding = renderHook(function(props)
			return useLifetime({ props.value })
		end, {
			initialProps = {
				value = 0,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		expect(result.current:getValue()).to.equal(0)
		local timePassed = task.wait(0.1)
		rerender({
			value = 0,
		})
		expect(result.current:getValue()).to.be:near(timePassed, 0.05)
		rerender({
			value = 1,
		})
		expect(result.current:getValue()).to.equal(0)
		unmount()
	end)
end
