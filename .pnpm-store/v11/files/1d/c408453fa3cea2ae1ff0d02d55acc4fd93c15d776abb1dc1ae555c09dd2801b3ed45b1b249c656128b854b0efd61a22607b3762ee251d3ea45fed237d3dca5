-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local RunService = TS.import(script, TS.getModule(script, "@rbxts", "services")).RunService
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useDeferEffect = TS.import(script, script.Parent, "use-defer-effect").useDeferEffect
return function()
	local wait = function()
		RunService.Heartbeat:Wait()
		RunService.Heartbeat:Wait()
	end
	it("should run the effect on the next heartbeat", function()
		local calls = 0
		local _binding = renderHook(function()
			useDeferEffect(function()
				local _original = calls
				calls += 1
				return _original
			end)
		end)
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		expect(calls).to.equal(0)
		wait()
		expect(calls).to.equal(1)
		wait()
		expect(calls).to.equal(1)
		rerender()
		expect(calls).to.equal(1)
		wait()
		expect(calls).to.equal(2)
		unmount()
	end)
	it("should run the effect on dependency change", function()
		local calls = 0
		local _binding = renderHook(function(value)
			useDeferEffect(function()
				local _original = calls
				calls += 1
				return _original
			end, { value })
		end, {
			initialProps = 0,
		})
		local unmount = _binding.unmount
		local rerender = _binding.rerender
		expect(calls).to.equal(0)
		wait()
		expect(calls).to.equal(1)
		rerender(1)
		expect(calls).to.equal(1)
		wait()
		expect(calls).to.equal(2)
		unmount()
	end)
	it("should cancel the effect on unmount", function()
		local calls = 0
		local _binding = renderHook(function()
			useDeferEffect(function()
				local _original = calls
				calls += 1
				return _original
			end)
		end)
		local unmount = _binding.unmount
		local rerender = _binding.rerender
		expect(calls).to.equal(0)
		wait()
		expect(calls).to.equal(1)
		rerender()
		unmount()
		wait()
		expect(calls).to.equal(1)
	end)
end
