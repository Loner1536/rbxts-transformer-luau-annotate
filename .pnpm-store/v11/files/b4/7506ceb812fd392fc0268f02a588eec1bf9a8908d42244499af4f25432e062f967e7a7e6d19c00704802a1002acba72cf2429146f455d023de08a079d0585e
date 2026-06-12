-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useLatestCallback = TS.import(script, script.Parent, "use-latest-callback").useLatestCallback
return function()
	it("should memoize the callback on mount", function()
		local callback = function() end
		local _binding = renderHook(function()
			return useLatestCallback(callback)
		end)
		local result = _binding.result
		expect(result.current).to.be.a("function")
		expect(result.current).never.to.equal(callback)
	end)
	it("should return memoized callback after unrelated rerender", function()
		local _binding = renderHook(function()
			return useLatestCallback(function() end)
		end)
		local result = _binding.result
		local rerender = _binding.rerender
		local memoizedCallback = result.current
		rerender()
		expect(result.current).to.equal(memoizedCallback)
	end)
	it("should return memoized callback after passed callback changes", function()
		local _binding = renderHook(function(_param)
			local callback = _param.callback
			return useLatestCallback(callback)
		end, {
			initialProps = {
				callback = function() end,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		local memoizedCallback = result.current
		rerender({
			callback = function() end,
		})
		expect(result.current).to.equal(memoizedCallback)
		rerender({
			callback = function() end,
		})
		expect(result.current).to.equal(memoizedCallback)
	end)
	it("should memoize new callbacks", function()
		local _binding = renderHook(function(_param)
			local callback = _param.callback
			return useLatestCallback(callback)
		end, {
			initialProps = {
				callback = function(a, b)
					return a + b
				end,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		local memoizedCallback = result.current
		expect(memoizedCallback(1, 2)).to.equal(3)
		rerender({
			callback = function(a, b)
				return a - b
			end,
		})
		expect(memoizedCallback(1, 2)).to.equal(-1)
	end)
end
