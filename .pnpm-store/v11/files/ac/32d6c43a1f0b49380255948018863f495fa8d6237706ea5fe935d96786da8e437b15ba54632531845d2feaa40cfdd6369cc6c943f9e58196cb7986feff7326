-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useDebounceState = TS.import(script, script.Parent, "use-debounce-state").useDebounceState
return function()
	it("should debounce the state", function()
		local _binding = renderHook(function()
			local state, setState = useDebounceState(0, {
				wait = 0.02,
			})
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(result.current.state).to.equal(0)
		result.current.setState(0)
		result.current.setState(1)
		result.current.setState(0)
		result.current.setState(1)
		expect(result.current.state).to.equal(0)
		task.wait(0.04)
		expect(result.current.state).to.equal(1)
		result.current.setState(2)
		expect(result.current.state).to.equal(1)
		task.wait(0.04)
		expect(result.current.state).to.equal(2)
		result.current.setState(2)
		expect(result.current.state).to.equal(2)
		task.wait(0.04)
		expect(result.current.state).to.equal(2)
		result.current.setState(3)
		expect(result.current.state).to.equal(2)
		result.current.setState(4)
		expect(result.current.state).to.equal(2)
		task.wait(0.04)
		expect(result.current.state).to.equal(4)
		unmount()
	end)
end
