-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useTimeout = TS.import(script, script.Parent, "use-timeout").useTimeout
return function()
	it("should run the callback after the delay", function()
		local count = 0
		local _binding = renderHook(function()
			useTimeout(function()
				local _original = count
				count += 1
				return _original
			end, 0.03)
		end)
		local unmount = _binding.unmount
		expect(count).to.equal(0)
		task.wait(0.04)
		expect(count).to.equal(1)
		task.wait(0.04)
		expect(count).to.equal(1)
		unmount()
	end)
	it("should clear when delay is undefined", function()
		local count = 0
		local _binding = renderHook(function(_param)
			local delay = _param.delay
			useTimeout(function()
				local _original = count
				count += 1
				return _original
			end, delay)
		end, {
			initialProps = {
				delay = 0.06,
			},
		})
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		expect(count).to.equal(0)
		task.wait(0.01)
		expect(count).to.equal(0)
		rerender({
			delay = nil,
		})
		task.wait(0.07)
		expect(count).to.equal(0)
		unmount()
	end)
	it("should clear on unmount", function()
		local count = 0
		local _binding = renderHook(function()
			useTimeout(function()
				local _original = count
				count += 1
				return _original
			end, 0.06)
		end)
		local unmount = _binding.unmount
		expect(count).to.equal(0)
		task.wait(0.01)
		expect(count).to.equal(0)
		unmount()
		task.wait(0.06)
		expect(count).to.equal(0)
	end)
	it("should reset when delay updates", function()
		local count = 0
		local _binding = renderHook(function(_param)
			local delay = _param.delay
			useTimeout(function()
				local _original = count
				count += 1
				return _original
			end, delay)
		end, {
			initialProps = {
				delay = 0.06,
			},
		})
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		expect(count).to.equal(0)
		task.wait(0.01)
		expect(count).to.equal(0)
		rerender({
			delay = 0.06,
		})
		task.wait(0.01)
		expect(count).to.equal(0)
		rerender({
			delay = 0.12,
		})
		task.wait(0.07)
		expect(count).to.equal(0)
		task.wait(0.07)
		expect(count).to.equal(1)
		unmount()
	end)
	it("should return a clear function", function()
		local count = 0
		local _binding = renderHook(function()
			return useTimeout(function()
				local _original = count
				count += 1
				return _original
			end, 0.06)
		end)
		local result = _binding.result
		local unmount = _binding.unmount
		expect(count).to.equal(0)
		task.wait(0.01)
		expect(count).to.equal(0)
		result.current()
		task.wait(0.07)
		expect(count).to.equal(0)
		unmount()
	end)
end
