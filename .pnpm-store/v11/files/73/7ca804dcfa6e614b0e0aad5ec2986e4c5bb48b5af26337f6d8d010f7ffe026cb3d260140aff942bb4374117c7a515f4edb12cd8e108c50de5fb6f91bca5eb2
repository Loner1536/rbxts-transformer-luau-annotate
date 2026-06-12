-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useDeferCallback = TS.import(script, script.Parent, "use-defer-callback").useDeferCallback
return function()
	local wait = function()
		RunService.Heartbeat:Wait()
		RunService.Heartbeat:Wait()
	end
	it("should return a callback and a cancel function", function()
		local _binding = renderHook(function()
			local callback, cancel = useDeferCallback(function() end)
			return {
				callback = callback,
				cancel = cancel,
			}
		end)
		local result = _binding.result
		expect(result.current.callback).to.be.a("function")
		expect(result.current.cancel).to.be.a("function")
	end)
	it("should execute the callback on the next heartbeat", function()
		local calls = 0
		local _binding = renderHook(function()
			local callback = useDeferCallback(function()
				local _original = calls
				calls += 1
				return _original
			end)
			return {
				callback = callback,
			}
		end)
		local result = _binding.result
		result.current.callback()
		expect(calls).to.equal(0)
		wait()
		expect(calls).to.equal(1)
	end)
	it("should return a function that cancels the callback", function()
		local calls = 0
		local _binding = renderHook(function()
			local callback, cancel = useDeferCallback(function()
				local _original = calls
				calls += 1
				return _original
			end)
			return {
				callback = callback,
				cancel = cancel,
			}
		end)
		local result = _binding.result
		result.current.callback()
		expect(calls).to.equal(0)
		result.current.cancel()
		wait()
		expect(calls).to.equal(0)
	end)
	it("should cancel the previous callback when called again", function()
		local calls = 0
		local _binding = renderHook(function()
			local callback = useDeferCallback(function()
				local _original = calls
				calls += 1
				return _original
			end)
			return {
				callback = callback,
			}
		end)
		local result = _binding.result
		result.current.callback()
		result.current.callback()
		result.current.callback()
		expect(calls).to.equal(0)
		wait()
		expect(calls).to.equal(1)
	end)
	it("should execute the callback with the latest arguments", function()
		local calls = 0
		local _binding = renderHook(function()
			local callback = useDeferCallback(function(value)
				calls += value
				return calls
			end)
			return {
				callback = callback,
			}
		end)
		local result = _binding.result
		result.current.callback(1)
		result.current.callback(2)
		result.current.callback(3)
		expect(calls).to.equal(0)
		wait()
		expect(calls).to.equal(3)
	end)
end
