-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useThrottleEffect = TS.import(script, script.Parent, "use-throttle-effect").useThrottleEffect
return function()
	it("should throttle the effect", function()
		local count = 0
		local _binding = renderHook(function(_param)
			local input = _param.input
			return useThrottleEffect(function()
				count += 1
			end, { input }, {
				wait = 0.06,
			})
		end, {
			initialProps = {
				input = 0,
			},
		})
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		rerender({
			input = 1,
		})
		expect(count).to.equal(1)
		rerender({
			input = 1,
		})
		rerender({
			input = 1,
		})
		rerender({
			input = 1,
		})
		expect(count).to.equal(1)
		task.wait(0.04)
		rerender({
			input = 2,
		})
		expect(count).to.equal(1)
		task.wait(0.03)
		rerender({
			input = 2,
		})
		expect(count).to.equal(2)
		rerender({
			input = 3,
		})
		rerender({
			input = 3,
		})
		task.wait(0.065)
		expect(count).to.equal(3)
		unmount()
	end)
end
