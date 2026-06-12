-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useAsyncEffect = TS.import(script, script.Parent, "use-async-effect").useAsyncEffect
return function()
	it("should run the effect", function()
		local calls = 0
		renderHook(function()
			return useAsyncEffect(TS.async(function()
				local _original = calls
				calls += 1
				return _original
			end), {})
		end)
		expect(calls).to.equal(1)
	end)
	it("should run the effect when the dependencies change", function()
		local calls = 0
		local _binding = renderHook(function(deps)
			return useAsyncEffect(TS.async(function()
				local _original = calls
				calls += 1
				return _original
			end), deps)
		end, {
			initialProps = { 0 },
		})
		local rerender = _binding.rerender
		expect(calls).to.equal(1)
		rerender({ 1 })
		expect(calls).to.equal(2)
	end)
	it("should cancel the effect when unmounting", function()
		local calls = 0
		local _binding = renderHook(function()
			useAsyncEffect(TS.async(function()
				calls += 1
				return TS.Promise.delay(0):andThen(function()
					calls += 1
				end)
			end), {})
		end)
		local unmount = _binding.unmount
		expect(calls).to.equal(1)
		unmount()
		expect(calls).to.equal(1)
	end)
	it("should allow promises to complete", function()
		local calls = 0
		renderHook(function()
			useAsyncEffect(TS.async(function()
				calls += 1
				return TS.Promise.delay(0):andThen(function()
					calls += 1
				end)
			end), {})
		end)
		expect(calls).to.equal(1)
		task.wait(0.04)
		expect(calls).to.equal(2)
	end)
end
