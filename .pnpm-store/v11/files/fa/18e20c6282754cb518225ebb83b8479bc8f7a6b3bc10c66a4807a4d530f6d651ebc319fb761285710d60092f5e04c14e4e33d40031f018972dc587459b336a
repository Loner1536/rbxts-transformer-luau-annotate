-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useUnmountEffect = TS.import(script, script.Parent, "use-unmount-effect").useUnmountEffect
return function()
	it("should call when component unmounts", function()
		local called = false
		local _binding = renderHook(function()
			return useUnmountEffect(function()
				called = true
				return called
			end)
		end)
		local unmount = _binding.unmount
		expect(called).to.equal(false)
		unmount()
		expect(called).to.equal(true)
	end)
	it("should not call on rerender", function()
		local called = false
		local _binding = renderHook(function()
			return useUnmountEffect(function()
				called = true
				return called
			end)
		end)
		local rerender = _binding.rerender
		expect(called).to.equal(false)
		rerender()
		expect(called).to.equal(false)
	end)
	it("should call the last callback on unmount", function()
		local called = 0
		local _binding = renderHook(function(callback)
			return useUnmountEffect(callback)
		end, {
			initialProps = function()
				called = 0
				return called
			end,
		})
		local rerender = _binding.rerender
		local unmount = _binding.unmount
		rerender(function()
			called += 1
			return called
		end)
		unmount()
		expect(called).to.equal(1)
	end)
end
