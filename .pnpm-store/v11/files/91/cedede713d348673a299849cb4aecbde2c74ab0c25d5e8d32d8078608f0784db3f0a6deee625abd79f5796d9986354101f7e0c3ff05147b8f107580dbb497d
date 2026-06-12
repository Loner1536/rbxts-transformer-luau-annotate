-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useTimer = TS.import(script, script.Parent, "use-timer").useTimer
return function()
	it("should start the timer on mount", function()
		local _binding = renderHook(function()
			return useTimer()
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current.value:getValue()).to.equal(0)
		local timePassed = task.wait(0.2)
		expect(result.current.value:getValue()).to.be:near(timePassed, 0.08)
		unmount()
	end)
	it("should return functions to start and stop the timer", function()
		local _binding = renderHook(function()
			return useTimer()
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current.value:getValue()).to.equal(0)
		local timePassed = task.wait(0.2)
		local timerValue = result.current.value:getValue()
		expect(timerValue).to.be:near(timePassed, 0.08)
		result.current.stop()
		task.wait(0.2)
		expect(result.current.value:getValue()).to.equal(timerValue)
		result.current.start()
		local timePassedAfterStart = task.wait(0.2)
		expect(result.current.value:getValue()).to.be:near(timePassed + timePassedAfterStart, 0.08)
		unmount()
	end)
	it("should return a function to set the timer", function()
		local _binding = renderHook(function()
			return useTimer()
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current.value:getValue()).to.equal(0)
		local timePassed = task.wait(0.2)
		expect(result.current.value:getValue()).to.be:near(timePassed, 0.08)
		result.current.reset()
		expect(result.current.value:getValue()).to.equal(0)
		result.current.set(1)
		expect(result.current.value:getValue()).to.equal(1)
		local timePassedAfterSet = task.wait(0.2)
		expect(result.current.value:getValue()).to.be:near(timePassedAfterSet + 1, 0.08)
		unmount()
	end)
end
