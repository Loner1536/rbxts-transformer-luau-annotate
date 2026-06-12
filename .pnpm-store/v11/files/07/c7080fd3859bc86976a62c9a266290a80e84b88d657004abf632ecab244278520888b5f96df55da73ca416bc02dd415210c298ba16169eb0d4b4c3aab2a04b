-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useDebounceCallback = TS.import(script, script.Parent, "use-debounce-callback").useDebounceCallback
return function()
	it("should return run, cancel, and flush", function()
		local count = 0
		local _binding = renderHook(function()
			return useDebounceCallback(function(amount)
				count += amount
				return count
			end, {
				wait = 0.02,
			})
		end)
		local result = _binding.result
		result.current.run(1)
		result.current.run(1)
		result.current.run(4)
		result.current.run(2)
		expect(count).to.equal(0)
		task.wait(0.04)
		expect(count).to.equal(2)
		result.current.run(4)
		expect(count).to.equal(2)
		task.wait(0.04)
		expect(count).to.equal(6)
		result.current.run(4)
		expect(count).to.equal(6)
		result.current.cancel()
		expect(count).to.equal(6)
		task.wait(0.04)
		expect(count).to.equal(6)
		result.current.run(1)
		expect(count).to.equal(6)
		result.current.flush()
		expect(count).to.equal(7)
		task.wait(0.04)
		expect(count).to.equal(7)
	end)
end
