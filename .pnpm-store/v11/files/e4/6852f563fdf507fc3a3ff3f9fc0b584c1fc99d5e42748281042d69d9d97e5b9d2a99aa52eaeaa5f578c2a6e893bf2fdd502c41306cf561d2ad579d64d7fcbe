-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useThrottleCallback = TS.import(script, script.Parent, "use-throttle-callback").useThrottleCallback
return function()
	it("should return run, cancel, and flush", function()
		local count = 0
		local _binding = renderHook(function()
			return useThrottleCallback(function(amount)
				count += amount
				return count
			end, {
				wait = 0.06,
			})
		end)
		local result = _binding.result
		result.current.run(1)
		expect(count).to.equal(1)
		result.current.run(1)
		result.current.run(1)
		result.current.run(1)
		expect(count).to.equal(1)
		task.wait(0.04)
		result.current.run(2)
		expect(count).to.equal(1)
		task.wait(0.03)
		result.current.run(2)
		expect(count).to.equal(3)
		result.current.run(3)
		result.current.run(3)
		task.wait(0.07)
		expect(count).to.equal(6)
		result.current.run(1)
		result.current.run(4)
		result.current.cancel()
		task.wait(0.07)
		expect(count).to.equal(7)
		result.current.run(1)
		result.current.run(1)
		expect(count).to.equal(8)
		result.current.flush()
		expect(count).to.equal(9)
		task.wait(0.07)
		expect(count).to.equal(9)
	end)
end
