-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useDeferState = TS.import(script, script.Parent, "use-defer-state").useDeferState
return function()
	local wait = function()
		RunService.Heartbeat:Wait()
		RunService.Heartbeat:Wait()
	end
	it("should return the state and a setter", function()
		local _binding = renderHook(function()
			local state, setState = useDeferState(0)
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		expect(result.current.state).to.equal(0)
		expect(result.current.setState).to.be.a("function")
	end)
	it("should update the state on heartbeat", function()
		local _binding = renderHook(function()
			local state, setState = useDeferState(0)
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		result.current.setState(1)
		expect(result.current.state).to.equal(0)
		wait()
		expect(result.current.state).to.equal(1)
	end)
	it("should only update the state once per frame", function()
		local _binding = renderHook(function()
			local state, setState = useDeferState(0)
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		result.current.setState(1)
		result.current.setState(2)
		result.current.setState(3)
		expect(result.current.state).to.equal(0)
		wait()
		expect(result.current.state).to.equal(3)
	end)
	it("should receive a function to update state", function()
		local _binding = renderHook(function()
			local state, setState = useDeferState(0)
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		result.current.setState(function(state)
			return state + 1
		end)
		result.current.setState(function(state)
			return state + 1
		end)
		result.current.setState(function(state)
			return state + 1
		end)
		expect(result.current.state).to.equal(0)
		wait()
		expect(result.current.state).to.equal(3)
	end)
	it("should only rerender once per frame", function()
		local renderCount = 0
		local _binding = renderHook(function()
			local state, setState = useDeferState(0)
			renderCount += 1
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		expect(renderCount).to.equal(1)
		result.current.setState(function(state)
			return state + 1
		end)
		result.current.setState(function(state)
			return state + 1
		end)
		result.current.setState(function(state)
			return state + 1
		end)
		expect(renderCount).to.equal(1)
		wait()
		expect(renderCount).to.equal(2)
	end)
	it("should cancel the update on unmount", function()
		local _binding = renderHook(function()
			local state, setState = useDeferState(0)
			return {
				state = state,
				setState = setState,
			}
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		result.current.setState(1)
		expect(result.current.state).to.equal(0)
		unmount()
		wait()
		expect(result.current.state).to.equal(0)
	end)
end
