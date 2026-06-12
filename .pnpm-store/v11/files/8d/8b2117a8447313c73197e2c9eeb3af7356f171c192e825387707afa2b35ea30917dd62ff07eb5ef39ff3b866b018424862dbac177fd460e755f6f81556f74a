-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
--/ <reference types="@rbxts/testez/globals" />
local renderHook = TS.import(script, script.Parent.Parent, "utils", "testez").renderHook
local useLatest = TS.import(script, script.Parent, "use-latest").useLatest
return function()
	it("should return a mutable ref", function()
		local _binding = renderHook(function()
			return useLatest(0)
		end)
		local result = _binding.result
		expect(result.current.current).to.equal(0)
	end)
	it("should update the ref when the value changes", function()
		local _binding = renderHook(function(props)
			return useLatest(props.value)
		end, {
			initialProps = {
				value = 0,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current.current).to.equal(0)
		rerender({
			value = 1,
		})
		expect(result.current.current).to.equal(1)
	end)
	it("should receive a function that determines whether the value should be updated", function()
		local value0 = {
			value = 0,
		}
		local value1 = {
			value = 0,
		}
		local value2 = {
			value = 1,
		}
		local _binding = renderHook(function(_param)
			local state = _param.state
			return useLatest(state, function(a, b)
				local _result = a
				if _result ~= nil then
					_result = _result.value
				end
				return _result == b.value
			end)
		end, {
			initialProps = {
				state = value0,
			},
		})
		local result = _binding.result
		local rerender = _binding.rerender
		expect(result.current.current).to.equal(value0)
		rerender({
			state = value1,
		})
		expect(result.current.current).to.equal(value0)
		rerender({
			state = value2,
		})
		expect(result.current.current).to.equal(value2)
	end)
end
