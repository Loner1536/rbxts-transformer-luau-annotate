-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useAsync = TS.import(script, script.Parent, "use-async").useAsync
return function()
	it("should run the promise on mount", function()
		local _binding = renderHook(function()
			local value, status, message = useAsync(function()
				return TS.Promise.resolve("foo")
			end)
			return {
				value = value,
				status = status,
				message = message,
			}
		end)
		local result = _binding.result
		expect(result.current.status).to.be.equal(TS.Promise.Status.Resolved)
		expect(result.current.value).to.be.equal("foo")
		expect(result.current.message).to.never.be.ok()
	end)
	it("should run the promise when the dependencies change", function()
		local _binding = renderHook(function(deps)
			local value, status, message = useAsync(function()
				return TS.Promise.resolve(deps[1])
			end, { deps })
			return {
				value = value,
				status = status,
				message = message,
			}
		end, {
			initialProps = { 0 },
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current.status).to.be.equal(TS.Promise.Status.Resolved)
		expect(result.current.value).to.be.equal(0)
		expect(result.current.message).to.never.be.ok()
		rerender({ 1 })
		expect(result.current.status).to.be.equal(TS.Promise.Status.Resolved)
		expect(result.current.value).to.be.equal(1)
		expect(result.current.message).to.never.be.ok()
	end)
	it("should cancel the previous promise", function()
		local completions = 0
		local _binding = renderHook(function(deps)
			local value, status, message = useAsync(function()
				return TS.Promise.delay(0):andThen(function()
					completions += 1
					return completions
				end)
			end, { deps })
			return {
				value = value,
				status = status,
				message = message,
			}
		end, {
			initialProps = { 0 },
		})
		local result = _binding.result
		local rerender = _binding.rerender
		rerender({ 1 })
		rerender({ 2 })
		rerender({ 3 })
		expect(completions).to.be.equal(0)
		expect(result.current.status).to.be.equal(TS.Promise.Status.Started)
		expect(result.current.value).to.never.be.ok()
		expect(result.current.message).to.never.be.ok()
		task.wait(0.04)
		expect(completions).to.be.equal(1)
		expect(result.current.status).to.be.equal(TS.Promise.Status.Resolved)
		expect(result.current.value).to.be.equal(1)
		expect(result.current.message).to.never.be.ok()
	end)
	it("should update the state when the promise resolves", function()
		local _binding = renderHook(function()
			local value, status, message = useAsync(function()
				return TS.Promise.delay(0):andThen(function()
					return "foo"
				end)
			end)
			return {
				value = value,
				status = status,
				message = message,
			}
		end)
		local result = _binding.result
		expect(result.current.status).to.be.equal(TS.Promise.Status.Started)
		expect(result.current.value).to.never.be.ok()
		expect(result.current.message).to.never.be.ok()
		task.wait(0.04)
		expect(result.current.status).to.be.equal(TS.Promise.Status.Resolved)
		expect(result.current.value).to.be.equal("foo")
		expect(result.current.message).to.never.be.ok()
	end)
	it("should cancel the promise on unmount", function()
		local completions = 0
		local _binding = renderHook(function()
			useAsync(function()
				return TS.Promise.delay(0):andThen(function()
					completions += 1
					return completions
				end)
			end)
		end)
		local unmount = _binding.unmount
		unmount()
		task.wait(0.04)
		expect(completions).to.be.equal(0)
	end)
end
