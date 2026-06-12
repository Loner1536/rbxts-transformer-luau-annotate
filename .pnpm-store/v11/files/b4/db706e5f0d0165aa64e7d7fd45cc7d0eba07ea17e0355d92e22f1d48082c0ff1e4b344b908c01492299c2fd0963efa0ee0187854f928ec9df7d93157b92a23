-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useAsyncCallback = TS.import(script, script.Parent, "use-async-callback").useAsyncCallback
return function()
	it("should return the current state and a callback", function()
		local _binding = renderHook(function()
			local state, callback = useAsyncCallback(function()
				return TS.Promise.resolve("foo")
			end)
			return {
				state = state,
				callback = callback,
			}
		end)
		local result = _binding.result
		expect(result.current.state.status).to.be.equal(TS.Promise.Status.Started)
		expect(result.current.state.value).to.never.be.ok()
		expect(result.current.state.message).to.never.be.ok()
		expect(result.current.callback).to.be.a("function")
	end)
	it("should update the state when the promise resolves", function()
		local _binding = renderHook(function()
			local state, callback = useAsyncCallback(function()
				return TS.Promise.resolve("foo")
			end)
			return {
				state = state,
				callback = callback,
			}
		end)
		local result = _binding.result
		result.current.callback()
		expect(result.current.state.status).to.be.equal(TS.Promise.Status.Resolved)
		expect(result.current.state.value).to.be.equal("foo")
		expect(result.current.state.message).to.never.be.ok()
	end)
	it("should update the state when the promise rejects", function()
		local _binding = renderHook(function()
			local state, callback = useAsyncCallback(function()
				return TS.Promise.reject("foo")
			end)
			return {
				state = state,
				callback = callback,
			}
		end)
		local result = _binding.result
		result.current.callback()
		expect(result.current.state.status).to.be.equal(TS.Promise.Status.Rejected)
		expect(result.current.state.value).to.never.be.ok()
		expect(result.current.state.message).to.be.equal("foo")
	end)
	it("should cancel the previous promise", function()
		local completions = 0
		local _binding = renderHook(function()
			local state, callback = useAsyncCallback(function()
				return TS.Promise.delay(0):andThen(function()
					completions += 1
					return completions
				end)
			end)
			return {
				state = state,
				callback = callback,
			}
		end)
		local result = _binding.result
		result.current.callback()
		result.current.callback()
		result.current.callback()
		expect(completions).to.be.equal(0)
		expect(result.current.state.status).to.be.equal(TS.Promise.Status.Started)
		expect(result.current.state.value).to.never.be.ok()
		expect(result.current.state.message).to.never.be.ok()
		task.wait(0.04)
		expect(completions).to.be.equal(1)
		expect(result.current.state.status).to.be.equal(TS.Promise.Status.Resolved)
		expect(result.current.state.value).to.be.equal(1)
		expect(result.current.state.message).to.never.be.ok()
	end)
	it("should cancel when unmounting", function()
		local completions = 0
		local _binding = renderHook(function()
			local state, callback = useAsyncCallback(function()
				return TS.Promise.delay(0):andThen(function()
					completions += 1
					return completions
				end)
			end)
			return {
				state = state,
				callback = callback,
			}
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		result.current.callback()
		unmount()
		task.wait(0.04)
		expect(completions).to.be.equal(0)
	end)
end
