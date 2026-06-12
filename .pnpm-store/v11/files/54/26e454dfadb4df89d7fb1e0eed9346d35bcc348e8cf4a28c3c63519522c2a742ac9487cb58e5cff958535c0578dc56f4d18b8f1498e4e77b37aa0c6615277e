-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useThrottleState = TS.import(script, script.Parent, "use-throttle-state").useThrottleState
return function()
	it("should throttle the state", function()
		local _binding = renderHook(function()
			local state, setState = useThrottleState(0, {
				wait = 0.06,
			})
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		result.current.setState(1)
		expect(result.current.state).to.equal(1)
		result.current.setState(1)
		result.current.setState(1)
		result.current.setState(1)
		expect(result.current.state).to.equal(1)
		task.wait(0.04)
		result.current.setState(2)
		expect(result.current.state).to.equal(1)
		task.wait(0.03)
		result.current.setState(2)
		expect(result.current.state).to.equal(2)
		result.current.setState(3)
		result.current.setState(3)
		task.wait(0.065)
		expect(result.current.state).to.equal(3)
		unmount()
	end)
end
